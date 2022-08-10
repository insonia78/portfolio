import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { AssetService, GraphQLService, ApiModule } from '@spidersmart/ng';
import { initializeAuthentication, AppContextService, AuthInterceptor } from '@spidersmart/core';
import { SharedModule } from '@spidersmart/shared';
import { LayoutModule } from './layout/layout.module';
import { routes } from './app.routing';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    LayoutModule,
    MatTooltipModule,
    ApiModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (appContextService: AppContextService) => function() { appContextService.setEnvironmentVariables(environment); },
      deps: [AppContextService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthentication,
      multi: true,
      deps: [HttpClient, AppContextService, CookieService]
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        // floatLabel: 'always'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private gqlService: GraphQLService, private assetService: AssetService, private cookieService: CookieService) {
    // if using authorization set token
    const token = (environment.useAuthorization) ? this.cookieService.get('auth') : null;

    // set asset locations
    this.assetService.setPath(environment.uploadUrl);
    this.assetService.setPlaceholderImage(environment.placeholderImage);

    // initialize connection with api
    this.gqlService.connect(environment.apiUrl, token);
  }
}
