import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-check-vehicle-type',
  templateUrl: './check-vehicle-type.component.html',
  styleUrls: ['./check-vehicle-type.component.scss'],
})
export class CheckVehicleTypeComponent implements OnInit {
  constructor(
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<CheckVehicleTypeComponent>,
    private renderer: Renderer2,
    public router: Router,
    public dialogRef: MatDialogRef<CheckVehicleTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  isCheckWheeler: boolean = true;
  vaahanName: any;
  vehicleTypeValue: any;
  checkWheeler: any;
  traceIdData: any;
  ngOnInit(): void {
    this.sharedDataService.checkVehicleType.subscribe((res) => {
      if (res) {
        this.isCheckWheeler = res.isCheckWheeler;
        this.vaahanName = res.vaahanName;
        this.checkWheeler = JSON.parse(
          sessionStorage.getItem('checkWheeler') || '{}'
        );
      }
    });
  }

  /**
   * navigates to the motor insurance  page
   */
  newNumber() {
    this.dialogRef.close();
  }

  /**
   * continue with current Journey
   */
  proccedToCurrentJourney(checkWheeler: any) {
    if (checkWheeler['is_four_wheeler'] && !checkWheeler['is_two_wheeler']) {
      sessionStorage.setItem('vehicleType', 'private_car');
    }
    if (!checkWheeler['is_four_wheeler'] && checkWheeler['is_two_wheeler']) {
      sessionStorage.setItem('vehicleType', 'two_wheeler');
    }
    checkWheeler['is_four_wheeler'] = true;
    checkWheeler['is_two_wheeler'] = true;
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');

    sessionStorage.setItem('checkWheeler', JSON.stringify(checkWheeler));
    this.isCheckWheeler = true;
    this.dialogRef.removePanelClass('warn-details-class');
    this.dialogRef.addPanelClass('vehicle-details-class');
    this.sharedDataService.changeVehicleType(this.vehicleTypeValue);
    this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
    let traceValue = JSON.parse(this.traceIdData);
    this.router.navigate([`quotes/${traceValue.trace_id}`]);
    this.dialogRef.close();
  }
}
