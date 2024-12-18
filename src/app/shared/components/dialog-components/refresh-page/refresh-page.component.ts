import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refresh-page',
  templateUrl: './refresh-page.component.html',
  styleUrls: ['./refresh-page.component.scss']
})
export class RefreshPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  reload(){
    window.location.reload();
  }
}
