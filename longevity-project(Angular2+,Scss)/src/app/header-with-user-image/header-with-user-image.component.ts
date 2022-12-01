import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-with-user-image',
  templateUrl: './header-with-user-image.component.html',
  styleUrls: ['./header-with-user-image.component.scss']
})
export class HeaderWithUserImageComponent implements OnInit {
   name:string = "Esther" 
  constructor() { }

  ngOnInit(): void {
  }
  getName(){
    return this.name;
  }
}
