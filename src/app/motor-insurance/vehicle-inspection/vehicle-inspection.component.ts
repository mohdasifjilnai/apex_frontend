import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection.component.html',
  styleUrls: ['./vehicle-inspection.component.scss'],
})
export class VehicleInspectionComponent implements OnInit {
  constructor(
    public router: Router,
    private apiservice: ApiService,
    private route: ActivatedRoute
  ) {}
  inspection: any;
  inspectionList: any;
  quotesData: any;
  insurerData: any;
  transactionId: any;
  ngOnInit(): void {
    this.route.url.subscribe((segments: { path: any }[]) => {
      const urlSegments = segments.map(
        (segment: { path: any }) => segment.path
      );
      this.transactionId = urlSegments[2];
    });
    sessionStorage.setItem('isPayment', 'true');
    this.inspectionData();
  }

  inspectionData() {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_inspection_data}?transaction_id=${this.transactionId}`
      )
      .subscribe((res) => {
        this.inspectionList = res;
      });
  }
  back() {
    this.router.navigate(['quotes/proposal']);
  }
}
