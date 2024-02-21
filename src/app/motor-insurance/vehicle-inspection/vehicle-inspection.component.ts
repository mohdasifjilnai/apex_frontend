import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection.component.html',
  styleUrls: ['./vehicle-inspection.component.scss'],
})
export class VehicleInspectionComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}
  back() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
}
