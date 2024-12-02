import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumb';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';

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
  is_cse: any;
  employee_code: any;
  partner_code: any;
  partnerCodewithTraceId: any;
  transactionId: any;
  id: any;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router,
    private sharedData:SharedDataService,
    private apiService:ApiService,
    private route: ActivatedRoute,
  ) {
    // get breadcrumb label data
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    const idMatch = currentUrl.match(/\/quotes\/proposal\/([^/]+)\//);
    const id = idMatch ? idMatch[1] : null;
    if (window.screen.width >= 999) {
      if(id!=null){
        this.getPartnerCode(id)
      }
    } 
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
    this.is_cse = sessionStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = sessionStorage.getItem('employee_code');
    this.partnerCodewithTraceId=JSON.parse(sessionStorage.getItem('partnerCodeTraceId') || '{}')
    if(this.partnerCodewithTraceId?.partner_code){
      this.partner_code=this.partnerCodewithTraceId?.partner_code
    }
    this.sharedData.partnerCodeFromApiRes.subscribe((res) => {
      if (res) {
        this.partner_code=res
      }
    });
    this.partner_code = sessionStorage.getItem('partner_code');

  }

  /**
   * Redirects the user to the home page.
   */
  redirectHome() {
    this.router.navigate(['']);
  }
  getPartnerCode(transaction_id:any){
    let apiUrl;
    apiUrl = `?transaction_id=${transaction_id}`;
    this.apiService
      .getRequestedResponse(`${ApiConstants.fetch_partner_code}${apiUrl}`)
      .subscribe((res: any) => {
        this.partner_code=res?.partner_code
        this.employee_code=res?.employee_code
        if(res?.partner_code!=null){
          sessionStorage.setItem('partner_code',res?.partner_code)
        }
        if(res?.employee_code!=null){
          sessionStorage.setItem('employee_code',res?.employee_code)
        }
    });
  }
}
