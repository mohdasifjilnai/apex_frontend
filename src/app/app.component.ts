import { Component } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
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

  constructor(private sseService: SseService,private loaderService: LoaderService) {}
  isLoading: boolean = false;
  ngOnInit(): void {
    this.loaderService.isLoading().subscribe((isLoading:any) => {
      this.isLoading = isLoading;
      if(!isLoading){
        return
      }
    });
  }
}
