import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService, Assignment, GraphQLResponse, Permission } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService, PageActionDirective } from '@spidersmart/core';

@Component({
  selector: 'sm-assignment-answer-key',
  templateUrl: './assignment-answer-key.component.html',
  styleUrls: ['./assignment-answer-key.component.scss']
})
export class AssignmentAnswerKeyComponent implements OnInit {
  /** The current assignment */
  public assignment: Assignment;

   /**
    * @ignore
    */
  constructor(
    private appContextService: AppContextService,
    private assignmentService: AssignmentService,
    private activatedRoute: ActivatedRoute,
    private pageService: PageService
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.assignmentService.get(this.activatedRoute.snapshot.params.id).subscribe((response: GraphQLResponse<Assignment>) => {
        this.assignment = response.data;
        this.pageService.setTitle(response.data.title + ' (' + response.data.level.subject.name + ' ' + response.data.level.name + ')');
      });

      this.pageService.addDirectiveAction(PageActions.print, PageActionDirective.PRINT_ASSIGNMENT, {id: this.activatedRoute.snapshot.params.id});
    }
  }
}
