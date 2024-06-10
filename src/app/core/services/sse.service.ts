import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private eventSource!: EventSource;
  routerEvents: any;
  currentPageUrl: any;
  constructor(private zone: NgZone, private router: Router) {
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPageUrl = event.url;
      }
    });
  }

  getServerSentEvent(url: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      const eventSource = this.getEventSource(url);
      eventSource.onopen = (ev) => {
        console.log('Connection to server opened.', ev);
        if (!this.currentPageUrl.includes('/quotes')) {
          eventSource.close();
        } else if (this.currentPageUrl.includes('/proposal')) {
          eventSource.close();
        }
      };
      eventSource.onerror = (ev) => {
        console.log('EventSource failed.', ev);
      };
      eventSource.addEventListener('quotes', (event) => {
        this.zone.run(() => {
          observer.next(event);
          if (!this.currentPageUrl.includes('/quotes')) {
            console.log('Connection Drop', event);
            eventSource.close();
          } else if (this.currentPageUrl.includes('/proposal')) {
            eventSource.close();
          }
          // setTimeout(() => {
          //   console.log('Connection Drop', event);
          //   eventSource.close();
          // }, 40000);
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
