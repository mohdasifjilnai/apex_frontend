import { Component, ElementRef, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'apex_frontend';

  constructor() { }

  ngOnInit(): void {
  }

 
}
