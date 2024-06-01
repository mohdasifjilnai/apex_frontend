import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input('progress') progress: any;
  breadcrumbs$: Observable<Breadcrumb[]>;
  routerEvents: any;
  reviewPageUrl = false;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    // get breadcrumb label data
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('review')) {
          this.reviewPageUrl = true;
        } else {
          this.reviewPageUrl = false;
        }
      }
    });

    if (currentUrl.includes('review')) {
      this.reviewPageUrl = true;
    } else {
      this.reviewPageUrl = false;
    }
  }

  /**
   * Redirects the user to the home page.
   */
  redirectHome() {
    this.router.navigate(['']);
  }
}
