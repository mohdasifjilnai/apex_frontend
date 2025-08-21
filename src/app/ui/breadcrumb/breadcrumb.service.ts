import { Injectable, Input } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();
  traceId: any;
  partnerCodeTraceId: any;

  constructor(private router: Router) {
    this.transferLocalStorageToSessionStorage();
    this.router.events
      .pipe(
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: Breadcrumb[] = [];
        this.addBreadcrumb(root, [], breadcrumbs);

        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[]
  ) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
      this.partnerCodeTraceId = JSON.parse(
        sessionStorage.getItem('partnerCodeTraceId') || '{}'
      );
      this.traceId = this.partnerCodeTraceId?.trace_id;
      // Add an element for the current route part
      if (route.data['breadcrumb']) {
        if (Array.isArray(route.data['breadcrumb'])) {
          route.data['breadcrumb'].forEach((bc: any) => {
            const breadcrumbUrl = bc['path']
              ? '/' + bc['path'].join('/')
              : '/' + routeUrl.join('/');
            // Add this.traceId to the URL if path contains 'quotes'
            const finalUrl =
              breadcrumbUrl.includes('quotes') &&
              !breadcrumbUrl.includes('proposal')
                ? `${breadcrumbUrl}/${this.traceId}`
                : breadcrumbUrl;
            const breadcrumb = {
              label: this.getLabel({ breadcrumb: bc['name'] }),
              url: finalUrl,
            };
            breadcrumbs.push(breadcrumb);
          });
        } else {
          const breadcrumbUrl = '/' + routeUrl.join('/');

          // Add traceId to the URL if path contains 'quotes'
          const finalUrl =
            breadcrumbUrl.includes('quotes') &&
            !breadcrumbUrl.includes('proposal')
              ? `${breadcrumbUrl}/${this.traceId}`
              : breadcrumbUrl;

          const breadcrumb = {
            label: this.getLabel(route.data),
            url: finalUrl,
          };
          breadcrumbs.push(breadcrumb);
        }
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function'
      ? data['breadcrumb'](data)
      : data['breadcrumb'];
  }
  transferLocalStorageToSessionStorage(): void {
    for (let i = 0; i < localStorage.length + 1; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          sessionStorage.setItem(key, value);
          // localStorage.removeItem(key)
        }
      }
    }
    // localStorage.clear();
  }
}
