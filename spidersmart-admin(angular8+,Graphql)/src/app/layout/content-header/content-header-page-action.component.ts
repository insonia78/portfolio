import { Component, Input, ElementRef, ViewChild, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageService, PageAction, PageActionDirective } from '@spidersmart/core';

@Component({
  selector: 'app-content-header-page-action',
  templateUrl: './content-header-page-action.component.html',
  styleUrls: ['./content-header-page-action.component.scss'],
})
export class ContentHeaderPageActionComponent implements OnInit {
  public PageActionDirective = PageActionDirective;

  /**
   * The action to generate a page action trigger for
   */
  @Input() action: PageAction = null;

  constructor(
    public pageService: PageService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    
  }
}