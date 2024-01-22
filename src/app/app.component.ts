import { Component, ElementRef, ViewChild } from '@angular/core';
import { WindowRef } from './services/window-ref.service';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'apex_frontend';

  constructor(private win: WindowRef, private authService: AuthService,) { }

  ngOnInit(): void {
  }

 
}
