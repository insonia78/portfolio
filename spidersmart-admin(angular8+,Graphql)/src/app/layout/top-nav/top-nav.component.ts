import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { take, takeUntil, filter } from 'rxjs/operators';
import { Permission } from '@spidersmart/ng';
import { AppContextService, Context, NavigationItem, TopNavigationService } from '@spidersmart/core';

/**
 * Displays the top navigation menu
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit, OnDestroy {
  /** The current context of the application */
  public currentContext: Context = null;
  /** Whether the mobile menu launcher is shown */
  public showMobile: boolean = false;
  /** used to destroy any subscriptions when component is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();

  /** The list of centers which is available for the user to select from when changing context */
  @ViewChild('centerList', { static: true }) centerList: MatMenu;

  /**
   * @ignore
   */
  constructor(
    public appContextService: AppContextService,
    public topNavigationService: TopNavigationService
  ) {
    this.appContextService.getContext().pipe(takeUntil(this.ngUnsubscribe)).subscribe(context => {
      this.currentContext = context;
    });
  }

  /**
   * Initialize the menu structure
   */
  ngOnInit() {
    this.topNavigationService.addSection(Context.CENTERS, 'All Centers');
    this.topNavigationService.addSectionTrigger(Context.CENTERS, (): MatMenu => {
      return this.centerList;
    });
    this.topNavigationService.addItem(Context.CENTERS, 'Center Details', ['/center'], [Permission.CENTER_VIEW, Permission.CENTER_CREATE, Permission.CENTER_UPDATE, Permission.CENTER_DELETE]);
    this.topNavigationService.addItem(Context.CENTERS, 'Students', ['/student'], [Permission.STUDENT_VIEW, Permission.STUDENT_VIEW_ASSIGNED, Permission.STUDENT_CREATE, Permission.STUDENT_UPDATE, Permission.STUDENT_DELETE]);
    this.topNavigationService.addItem(Context.CENTERS, 'Teachers', ['/teacher'], [Permission.TEACHER_VIEW, Permission.TEACHER_CREATE, Permission.TEACHER_UPDATE, Permission.TEACHER_DELETE]);
    this.topNavigationService.addItem(Context.CENTERS, 'Submissions', ['/assignment-submission'], [Permission.ASSIGNMENT_REVIEW]);
    this.topNavigationService.addItem(Context.CENTERS, 'Book Checkouts', ['/book-checkout'], [Permission.STUDENT_UPDATE]);

    this.topNavigationService.addSection(Context.ASSIGNMENTS, 'Assignments');
    this.topNavigationService.addItem(Context.ASSIGNMENTS, 'Assignments', ['/assignment'], [Permission.ASSIGNMENT_VIEW, Permission.ASSIGNMENT_CREATE, Permission.ASSIGNMENT_UPDATE, Permission.ASSIGNMENT_DELETE]);
    this.topNavigationService.addItem(Context.ASSIGNMENTS, 'Subjects', ['/subject'], [Permission.SUBJECT_VIEW, Permission.SUBJECT_CREATE, Permission.SUBJECT_UPDATE, Permission.SUBJECT_DELETE]);

    this.topNavigationService.addSection(Context.BOOKS, 'Books');
    this.topNavigationService.addItem(Context.BOOKS, 'Approved Books', ['/approved-books'], [Permission.BOOK_VIEW, Permission.BOOK_CREATE, Permission.BOOK_UPDATE, Permission.BOOK_DELETE]);
    this.topNavigationService.addItem(Context.BOOKS, 'Authors', ['/authors'], [Permission.AUTHOR_VIEW, Permission.AUTHOR_CREATE, Permission.AUTHOR_UPDATE, Permission.AUTHOR_DELETE]);
    this.topNavigationService.addItem(Context.BOOKS, 'Genres', ['/genre'], [Permission.GENRE_VIEW, Permission.GENRE_CREATE, Permission.GENRE_UPDATE, Permission.GENRE_DELETE]);
    this.topNavigationService.addItem(Context.BOOKS, 'Publisher', ['/publisher'], [Permission.PUBLISHER_VIEW, Permission.PUBLISHER_CREATE, Permission.PUBLISHER_UPDATE, Permission.PUBLISHER_DELETE]);

    // load the default page
    this.appContextService.getCurrentRoute().pipe(filter(route => !!route), take(1)).subscribe(route => {
      const newContext = this.topNavigationService.getRouteSection(route);
      if (newContext !== null && this.currentContext !== newContext) {
        this.currentContext = newContext;
      }
    });
  }

  /**
   * Processes a selection from the context menu (top-most navigation menu)
   * @param context The context which was selected
   * @param navItem The navigation which was selected
   */
  public changeContext(context: Context, navItem?: NavigationItem): void {
    // don't do anything if this is already the current context
    if (this.currentContext === context) {
      return;
    }
    this.currentContext = context;
    this.appContextService.setContext(context);
    this.topNavigationService.routeToSectionDefault(context);
  }

  /**
   * Changes the current center context
   * @param id The id of the center to which context is changed
   * @param handle The handle of the center to which context is changed
   */
  chooseCenterContext(id: number | null, handle: string | null): void {
    // if no handle or no id, then set to all centers
    if (!handle || !id) {
      this.appContextService.setCenter(null);
      this.topNavigationService.updateSectionLabel(Context.CENTERS, 'All Centers');
    }
    // if single center, the user might need to be re-routed as well
    else {
      this.appContextService.getAccessibleCenters().pipe(take(1)).subscribe(centers => {
        const center = centers.find(ctr => ctr.id === id);
        if (center) {
          this.appContextService.setCenter(center);
          this.topNavigationService.updateSectionLabel(Context.CENTERS, center.name);
        }
      });
    }
    this.appContextService.printAppContext();

    // center context just changed, so the user should route to the centers context if not already there
    if (this.currentContext !== Context.CENTERS) {
      this.changeContext(Context.CENTERS);
    }

    // TODO: emit some event that can be captured by pages in the center context so that data can be updated accordingly
    // when context changes
    // OR trigger a page data reload through pageservice? - this would have to avoid triggering a reload on pages in assignment context for example,
    // but that may not be an issue since changing center context from another context would automatically switch the context over to centers anyway
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
