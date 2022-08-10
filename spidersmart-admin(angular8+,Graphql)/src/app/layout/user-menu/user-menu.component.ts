import { Component, OnInit } from '@angular/core';
import { AppContextService, PageService } from '@spidersmart/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  public logoutUrl = '';

  constructor(
    private appContextService: AppContextService
  ) {
    this.logoutUrl = this.appContextService.getEnvironmentVariable('authUrl');
  }
}
