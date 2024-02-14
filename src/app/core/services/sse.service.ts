import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource!: EventSource;

  constructor(private zone: NgZone) {}

  getServerSentEvent(url: string): Observable<MessageEvent> {
    return new Observable(observer => {
      const eventSource = this.getEventSource(url);
      eventSource.onopen = (ev) => {
        console.log('Connection to server opened.', ev);
      };
      eventSource.onerror = (ev) => {
        console.log('EventSource failed.', ev);
      };
     
      eventSource.addEventListener('quotes', event => {
        this.zone.run(() => {
          observer.next(event);
        });
      });
    });
  }
  private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      console.log('EventSource closed.');
      this.eventSource.close();
    }
    this.eventSource = new EventSource(url);
    return this.eventSource;
  }
}
