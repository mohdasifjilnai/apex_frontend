import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    // get breadcrumb label data
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {}

  /**
   * Redirects the user to the home page.
   */
  redirectHome() {
    this.router.navigate(['/motor']);
  }
}
