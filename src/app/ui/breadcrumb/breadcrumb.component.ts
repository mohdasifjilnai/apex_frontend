import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumb',
 
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input('progress') progress: any;
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    console.log( this.breadcrumbs$);
    
  }

  ngOnInit(): void {
  }



}
