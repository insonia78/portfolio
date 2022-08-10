import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterEvent } from '@angular/router';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  AppContextService,
  PageService,
  PageError
} from '@spidersmart/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public today = new Date();
  public isImpersonating = false;
  /** Used to store current route which can be used to update the history when the route changes */
  private currentRoute: any[] = [];

  /**
   * @ignore
   */
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private appContextService: AppContextService,
    public pageService: PageService,
    private toastService: ToastrService,
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    // handle impersonation
    this.appContextService.isUserImpersonated().pipe(take(1)).subscribe(impersonating => {
      console.log('IMPERSONATION UPDATED....', impersonating);
      this.isImpersonating = impersonating;
    });

    // handle routing events
    this.router.events.subscribe((event: RouterEvent) => {
      // handle pre-navigation actions
      if (event instanceof NavigationStart) {
        // show page loader
        this.pageService.setLoading(true);
      }
      // handle post-navigation actions
      if (event instanceof NavigationEnd) {
        // store previous route into the navigation history
        let pageTitle = '';
        this.pageService.getTitle().pipe(take(1)).subscribe(title => pageTitle = title);
        this.appContextService.storeCurrentRouteInNavigationHistory(pageTitle);
        // update app context with newly loaded route
        this.appContextService.setCurrentRoute((event.url === '/') ? ['/'] : event.url.substring(1).split('/'));

        // clear actions and title of page if this is a different page (not a refresh)
        this.appContextService.getNavigationHistory().pipe(take(1)).subscribe(navigationHistory => {
          if (navigationHistory.length > 0 && event.urlAfterRedirects !== '/' + navigationHistory[navigationHistory.length - 1].route.join('/')) {
            this.pageService.clearActions();
            this.pageService.clearTitle();
          }
        });

        // hide page loader
        this.pageService.setLoading(false);

        // detect changes to prevent issues from title and loader changes from loaded route
        this.cdRef.detectChanges();
      }
    });

    // set subscription to watch for triggered page errors and display when triggered
    this.pageService.getPageErrors().subscribe((errors: PageError[]) => {
      errors.forEach(error => {
        this.toastService.error(error.message, 'Error');
      });
    });
  }

  /**
   * Stops user impersonation
   */
  public stopImpersonation = (): void => {
    this.pageService.setLoading(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.cookieService.get('auth')
      })
    }
    this.http.post(this.appContextService.getEnvironmentVariable('authUrl') + '/stop-impersonation', null, httpOptions).pipe(
      take(1)
    ).subscribe((response: any) => {
      this.pageService.setLoading(false);
      if (response && response.hasOwnProperty('access_token')) {
        this.cookieService.set('auth', response.access_token, { domain: response.domain });
        if (response.hasOwnProperty('redirect')) {
          window.location.href = response.redirect;
        }
      }
    });
  }
}
