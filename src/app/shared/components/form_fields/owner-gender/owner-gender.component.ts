import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owner-gender',
  templateUrl: './owner-gender.component.html',
  styleUrls: ['./owner-gender.component.scss']
})
export class OwnerGenderComponent implements OnInit {
  genderList:any;

  constructor() {
    this.genderList = [ 
      {
        id:1,
        name:"Male"
      },
      {
        id:2,
        name:"Female"
      }
    ]
   }

  ngOnInit(): void {
  }

}
