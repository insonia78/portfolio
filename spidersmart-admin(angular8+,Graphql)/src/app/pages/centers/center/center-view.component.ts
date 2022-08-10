import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, finalize } from 'rxjs/operators';
import { Center, GraphQLResponse, CenterService, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'sm-center-view',
  templateUrl: './center-view.component.html',
  styleUrls: [ './center-view.component.scss' ]
})
export class CenterViewComponent implements OnInit, OnDestroy {
  /** The current center */
  public center: Center = null;
  /** used to destroy any subscriptions when component is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();
  public coords: google.maps.LatLngLiteral;
  public markerLabel: google.maps.MarkerLabel = null;
  public mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    mapTypeId: 'roadmap'
  };

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private centerService: CenterService,
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private router: Router
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      const centerId = Number(this.activatedRoute.snapshot.params.id);
      // set data source to reload (and potentially change) based on changes in center context
      combineLatest([
        this.appContextService.getCenter(),
        this.appContextService.getAccessibleCenters()
      ]).pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(([center, accessibleCenters]) => {
        if (accessibleCenters && accessibleCenters.length > 0) {

          if (center !== null && centerId !== center.id) {
            this.router.navigate(['/', 'center', center.id, 'view']);
            this.loadCenter(center.id);
          } else if (center === null) {
            if (accessibleCenters.findIndex(ctr => ctr.id === centerId) < 1) {
              this.router.navigate(['/', 'center', accessibleCenters[0].id, 'view']);
              this.loadCenter(accessibleCenters[0].id);
            }
          }
        }
      });

      // load the initial center
      if (this.center === null) {
        this.loadCenter(centerId);
      }
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads the center data of the center with the given id
   * @param id The id for which center details should load
   */
  private loadCenter(id: number = null): void {
    if (id === null) {
      return;
    }

    this.pageService.setLoading(true);
    this.centerService.get(id).pipe(
      take(1),
      finalize(() => {
          this.pageService.setLoading(false);
      })
    ).subscribe((response: GraphQLResponse<Center>) => {
      this.center = response.data;
      if (this.center.latitude && this.center.longitude) {
        this.coords = { lat: parseFloat(this.center.latitude), lng: parseFloat(this.center.longitude) };
      }
      this.markerLabel = {
        text: 'SpiderSmart ' + this.center.name,
        fontWeight: 'bold',
        color: '#333'
      };

      this.pageService.setTitle('Center Details');
      this.pageService.clearActions();
      if (this.appContextService.hasPermission(Permission.CENTER_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/center', id, 'edit']);
      }
      if (this.center.useInventory && this.appContextService.hasPermission(Permission.CENTER_MANAGE_BOOKS)) {
        this.pageService.addRoutingAction(PageActions.bookInventory, ['/center', id, 'book-inventory']);
      }
    });
  }
}
