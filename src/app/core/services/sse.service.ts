import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private eventSource!: EventSource;
  routerEvents: any;
  currentPageUrl: any;
  tokenValue: any;
  constructor(private zone: NgZone, private router: Router) {
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPageUrl = event.url;
      }
    });
    this.tokenValue = localStorage.getItem('token');
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
          if(environment.dev){
            setTimeout(() => {
              console.log('Connection Drop', event);
              eventSource.close();
            }, 50000);
          }else{
            setTimeout(() => {
              console.log('Connection Drop', event);
              eventSource.close();
            }, 20000);
          }
          
        });
      });
    });
  }
  private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      console.log('EventSource closed.');
      this.eventSource.close();
    }

    this.eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Token ${this.tokenValue}`,
      },
    });

    return this.eventSource;
  }
}
