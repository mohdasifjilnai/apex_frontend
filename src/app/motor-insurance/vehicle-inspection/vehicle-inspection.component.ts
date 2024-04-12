import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection.component.html',
  styleUrls: ['./vehicle-inspection.component.scss'],
})
export class VehicleInspectionComponent implements OnInit {
  constructor(public router: Router) {}
  inspection: any;
  inspectionList: any;
  quotesData: any;
  insurerData: any;
  ngOnInit(): void {
    this.inspection = sessionStorage.getItem('breakIn');
    this.inspectionList = JSON.parse(this.inspection);
    this.quotesData = sessionStorage.getItem('quotes_data');
    this.insurerData = JSON.parse(this.quotesData);
    sessionStorage.setItem('isPayment', 'true');
  }
  back() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
}
