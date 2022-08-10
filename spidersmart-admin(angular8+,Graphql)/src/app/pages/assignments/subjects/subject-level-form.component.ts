import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, LevelService, Level, Subject, SubjectService, ApiValidator, EmptyLevel, FileUploadDialogComponent, UploadedFile } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'sm-subject-level-form',
    templateUrl: './subject-level-form.component.html',
    styleUrls: ['./subject-level-form.component.scss']
})
export class SubjectLevelFormComponent implements OnInit {
    /**
     * The subject under which the level resides
     */
    public subject: Subject;

    /**
     * Stores loaded level data
     */
    public level: Level = EmptyLevel;
    /**
     * Level form group
     */
    public form: FormGroup;
    /**
     * The default route back to the previous page
     */
    public backRoute = ['/subject'];

    /** 
     * @ignore
     */
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private pageService: PageService,
        private levelService: LevelService,
        private subjectService: SubjectService,
        private toastService: ToastrService,
    ) {
        this.form = this.fb.group({
            name: ['', null, ApiValidator],
            description: ['', null, ApiValidator],
            rule: ['', null, ApiValidator],
            vocabLines: ['', null, ApiValidator],
            shortAnswerLines: ['', null, ApiValidator],
            essayLines: ['', null, ApiValidator]
        });
    }

    ngOnInit() {
        // there must be a subject to move forward
        if (!this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.toastService.success('No subject was found.');
            this.router.navigate(['/subject']);
        }

        this.pageService.setMode(PageMode.CREATE);
        this.pageService.setTitle('Create Level');
        this.backRoute = ['/subject', this.activatedRoute.snapshot.params.id, 'level'];
        if (this.activatedRoute.snapshot.params.hasOwnProperty('levelId')) {
            this.pageService.setLoading(true);
            combineLatest([
                this.subjectService.get(this.activatedRoute.snapshot.params.id),
                this.levelService.get(this.activatedRoute.snapshot.params.levelId),
            ]).pipe(
                take(1),
                finalize(() => {
                    this.pageService.setLoading(false);
                })
            ).subscribe(([subject, level]) => {
                this.pageService.setMode(PageMode.EDIT);
                this.pageService.setTitle('Edit Level for ' + subject.data.name);
                Object.assign(this.level, level.data, { subject: subject.data });

                this.form.patchValue({
                    name: this.level.name,
                    description: this.level.description,
                    rule: this.level.rule,
                    vocabLines: this.level.vocabLines,
                    shortAnswerLines: this.level.shortAnswerLines,
                    essayLines: this.level.essayLines
                });
            });
        } else {
            this.subjectService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((subject: GraphQLResponse<Subject>) => {
                this.pageService.setTitle('Create Level for ' + subject.data.name);
                Object.assign(this.level, { subject: subject.data });
            });
        }
    }

    /**
     * Saves the form data
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.levelService.modify : this.levelService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The level was edited successfully!' : 'The level was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The level could not be edited.' : 'The level could not be created.';

        action(Object.assign({}, this.level, this.form.value)).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success(successResponse);
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.router.navigate(this.backRoute);
            }
            else {
                this.toastService.error(errorResponse);
            }
        });
    }

    /**
     * Adds files to the level
     */
    public addFiles(): void {
        const addFileDialog = this.dialog.open(FileUploadDialogComponent, {
            width: '500px',
            data: {
              title: 'Add File(s)',
              description: 'Choose the file(s) you would like to attach to the level.',
              allowedTypes: ['pdf'],
              availableRoles: ['assessment', 'answer_key'],
              defaultRole: 'assessment'
            }
        });

        addFileDialog.afterClosed().subscribe((files: UploadedFile[]) => {
            if (files && files.length > 0) {
                this.level.files = this.level.files.concat(files);
            }
        });
    }

    /**
     * Removes a file from the selected file list
     * 
     * @param file The file which should be removed
     */
    public removeFile(file: UploadedFile): void {
        const fileIndex = this.level.files.findIndex(selection => {
            // previously existing files will have an id which is guaranteed to identify the correct file
            // so use that if available
            if (file.hasOwnProperty('id')) {
                return selection.id === file.id;
            }

            // if it's a file that is added and not yet saved, try to find the correct file to remove by name and size
            // since that's all we have to look up with
            return (file.hasOwnProperty('file') && selection.hasOwnProperty('file') && file.file.name === selection.file.name && file.file.size === selection.file.size);
        });

        if (fileIndex > -1) {
            this.level.files.splice(fileIndex, 1);
        }
    }
}
