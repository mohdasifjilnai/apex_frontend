import { Component } from '@angular/core';
import { SseService } from './core/services/sse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'apex_frontend';
  connectionData: any;
  eventSource: any;

  constructor(private sseService: SseService) {}
}
