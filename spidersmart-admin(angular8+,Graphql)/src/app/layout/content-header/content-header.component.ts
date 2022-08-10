import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageService, PageActionPosition } from '@spidersmart/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
})
export class ContentHeaderComponent {
  public PageActionPosition = PageActionPosition;

  constructor(
    public pageService: PageService
  ) {}
}
