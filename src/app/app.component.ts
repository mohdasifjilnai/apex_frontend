import { Component } from '@angular/core';
import { SseService } from './core/services/sse.service';
// const EventSource: any = window['EventSource'];
// import { NgZone } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'apex_frontend';
  connectionData:any;
  evtSource:any;
  
  constructor(private sseService: SseService) {
    /**
     * service call for the server side event handling
     */
    this.sseService.getServerSentEvent('http://localhost:9090/ds/dyn/edit/getStatus?status=-403830982')
      .subscribe(ev => {
        console.log(ev);
        this.connectionData.push(ev.data);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('==> complete');
      });
  //   this.evtSource = new EventSource("http://localhost:8099/sse.php", { withCredentials: true });

  //   this.evtSource.onmessage = (e: { data: any; }) => {
  //     console.log('connection message');
  //      console.log(e.data);
  //  }
  //  this.evtSource.onerror = (e: any) => {
  //     console.log('connection error');
  //      console.log(e);
  //      this.evtSource.close();
  //  }
  //  this.evtSource.onopen = (e: any) => {
  //     console.log('connection open');
  //      console.log(e);
  //  }
  }
}
