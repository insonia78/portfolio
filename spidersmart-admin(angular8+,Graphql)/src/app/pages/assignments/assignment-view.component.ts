import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService, Assignment, GraphQLResponse, Permission } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService, PageActionDirective } from '@spidersmart/core';

@Component({
  selector: 'sm-assignment-view',
  templateUrl: './assignment-view.component.html',
  styleUrls: ['./assignment-view.component.scss']
})
export class AssignmentViewComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  /** The current assignment */
  public assignment: Assignment;

  /**
   * The placeholder image to show when an image is loading or has failed to load
   */
  get placeholderImage(): string {
    return this.appContextService.getEnvironmentVariable('placeholderImage');
  }

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
      if (this.appContextService.hasPermission(Permission.ASSIGNMENT_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/assignment', this.activatedRoute.snapshot.params.id, 'edit']);
      }
    }
  }
}
