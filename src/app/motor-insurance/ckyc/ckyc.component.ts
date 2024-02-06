import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ckyc',
  templateUrl: './ckyc.component.html',
  styleUrls: ['./ckyc.component.scss']
})
export class CkycComponent implements OnInit {
  kycList:any

  constructor() {
    this.kycList = [ 
      {
        id:1,
        name:"Yes"
      },
      {
        id:2,
        name:"No"
      }
    ]
   }

  ngOnInit(): void {
  }

}
