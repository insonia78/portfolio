import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take, finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
    GraphQLResponse,
    Book,
    Author,
    Publisher,
    Genre,
    Level,
    BookService,
    AuthorService,
    PublisherService,
    GenreService,
    ApiValidator
} from '@spidersmart/ng';
import { PageMode, PageService, AppContextService, isDataUrl } from '@spidersmart/core';


@Component({
    selector: 'sm-approved-book-form',
    templateUrl: './approved-book-form.component.html',
    styleUrls: ['./approved-book-form.component.scss']
})
export class ApprovedBookFormComponent implements OnInit {
    public PageMode = PageMode;
    /**
     * Stores loaded book data
     */
    public book: Book = {
        id: null,
        title: '',
        isbn: '',
        coverImagePath: null,
        level: null,
        authors: [],
        publishers: [],
        genres: [],
        dateFrom: null
    };
    /**
     * Reference to available authors
     */
    public availableAuthors: Author[] = [];
    public availablePublishers: Publisher[] = [];
    public availableGenres: Genre[] = [];
    public availableLevels: Level[] = [];

    /**
     * Book form group
     */
    public form: FormGroup;

    /**
     * The default route back to the previous page
     */
    public backRoute = ['/approved-books'];

    /**
     * Holder for any upload cover image file
     */
    private coverImageFile: File = null;

    /**
     * Data url string which holds the new image when selected for cover image but not yet saved
     */
    private coverImageTemp = null;

    /**
     * Accessor for cover image source
     */
    get coverImage() {
        // if there is a valid temporary image, we can show that
        if (isDataUrl(this.coverImageTemp)) {
            return this.coverImageTemp;
        }

        // otherwise, if there is a path provided, return that url
        if (this.form.get('coverImagePath').value) {
            return this.appContextService.getEnvironmentVariable('uploadUrl') + this.form.get('coverImagePath').value;
        }

        // finally, return a placeholder if nothing else exists
        return this.appContextService.getEnvironmentVariable('placeholderImage');
    }

    /**
     * The hidden file input used to select a local file
     */
    @ViewChild('coverImageUploader', { static: false }) coverImageUploader: ElementRef;

    /**
     * @ignore
     */
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public pageService: PageService,
        private bookService: BookService,
        private authorService: AuthorService,
        private publisherService: PublisherService,
        private genreService: GenreService,
        private toastService: ToastrService,
        private appContextService: AppContextService
    ) {
        this.form = this.fb.group({
            title: ['', null, ApiValidator],
            description: ['', null, ApiValidator],
            coverImagePath: ['', null],
            isbn: ['', null, ApiValidator],
            authors: [null, null, ApiValidator],
            publishers: [null, null, ApiValidator],
            genres: [null, null, ApiValidator],
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        // get authors
        this.authorService.getAll().pipe(take(1)).subscribe((response: GraphQLResponse<Author[]>) => {
            this.availableAuthors = response.data;
        });
        // get publishers
        this.publisherService.getAll().pipe(take(1)).subscribe((response: GraphQLResponse<Publisher[]>) => {
            this.availablePublishers = response.data;
        });
        // get genres
        this.genreService.getAll().pipe(take(1)).subscribe((response: GraphQLResponse<Genre[]>) => {
            this.availableGenres = response.data;
        });


        this.pageService.setTitle('Create Approved Book');
        this.pageService.setMode(PageMode.CREATE);

        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Approved Book');
            this.backRoute = ['/approved-books', this.activatedRoute.snapshot.params.id, 'view'];

            this.bookService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Book>) => {
                // update data object and form data to response data, then set form as initialized
                this.book = response.data;
                this.form.patchValue({
                    title: this.book.title,
                    isbn: this.book.isbn,
                    coverImagePath: this.book.coverImage,
                    description: this.book.description,
                    authors: this.book.authors,
                    publishers: this.book.publishers,
                    genres: this.book.genres
                });
                // remove cover image from book object - anything coming in will be string and already mapped to coverImagePath
                // anything going out will be expected to be an upload if sent
                delete this.book.coverImage;
            });
        }
    }

    /**
     * Launches the book cover image chooser
     */
    public chooseCoverImage() {
        this.coverImageUploader.nativeElement.click();
    }

    /**
     * Sets the book cover image selection
     * @param event The file selection event returned from the selector
     */
    public setCoverImage(event) {
        if (event.target.files && event.target.files[0]) {
            this.coverImageFile = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (readEvent) => {
                this.coverImageTemp = readEvent.target.result;
            };
        }
    }

    /**
     * Saves the form data
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.bookService.modify : this.bookService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The book was edited successfully!' : 'The book was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The book could not be edited.' : 'The book could not be created.';

        // define additional fields
        const derivedData = {};
        if (this.coverImageFile) {
            Object.assign(derivedData, { coverImage: this.coverImageFile });
        }
        Object.assign(derivedData, {
            level: { subject: {} }
        });

        action(Object.assign({}, this.book, this.form.value, derivedData)).pipe(
            take(1),
            catchError((err) => {
                Object.entries(this.form.controls).forEach(([name, control]) => control.updateValueAndValidity());
                this.toastService.error(errorResponse);
                throw errorResponse;
            }),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            this.toastService.success(successResponse);
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.router.navigate(this.backRoute);
        });
    }
}
