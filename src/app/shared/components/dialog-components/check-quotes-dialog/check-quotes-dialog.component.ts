import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
declare const webengage: any;
@Component({
  selector: 'app-check-quotes-dialog',
  templateUrl: './check-quotes-dialog.component.html',
  styleUrls: ['./check-quotes-dialog.component.scss'],
})
export class CheckQuotesDialogComponent implements OnInit {
  vehicleTypeValue: any;
  userType: any;
  constructor(
    public dialogRef: MatDialogRef<CheckQuotesDialogComponent>,
    private sharedDataService: SharedDataService,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  traceIdData: any;
  ngOnInit(): void {
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.userType = sessionStorage.getItem('partnerCodeTraceId')
      ? sessionStorage.getItem('partnerCodeTraceId')
      : sessionStorage.getItem('partner_code');
  }

  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }

  quotesChange() {
    webengage.track('Change_Insurer_Inititaed', {
      User_Type: this.userType?.partner_code ? 'Partner' : 'Customer',
      Motor_Type: this.vehicleTypeValue,
    });
    // sessionStorage.setItem('vehiclePopup', 'true');
    if (this.data == 'renewal') {
      sessionStorage.removeItem('vehiclePopup');
      let insurerApiData = {
        transaction_id: sessionStorage.getItem('transaction_id'),
        insurer_quote_id: sessionStorage.getItem('renewalInsurerQuotesId'),
      };
      this.sharedDataService.quotesDataOnRenewal(insurerApiData);

      this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
      let traceValue = JSON.parse(this.traceIdData);
      this.route.navigate([`quotes/${traceValue.trace_id}`]);
    } else {
      let allNCbValue = sessionStorage.getItem('allNCBDataProposal');
      if (allNCbValue) {
        let mmvValueData = sessionStorage.getItem('mmv_data');
        if (mmvValueData) {
          let mmvListData = JSON.parse(mmvValueData);
          mmvListData.addNcbBoth = JSON.parse(allNCbValue);
          mmvListData.ncb_discount = mmvListData.addNcbBoth.old_ncb_value;
          sessionStorage.setItem('mmv_data', JSON.stringify(mmvListData));
        }
      }
      sessionStorage.setItem('quotesUrl', 'true');
      this.traceIdData = sessionStorage.getItem('partnerCodeTraceId');
      let traceValue = JSON.parse(this.traceIdData);
      this.route.navigate([`quotes/${traceValue.trace_id}`]);
    }
    webengage.track('Change_Insurer_Clicked', {
      Option_Selected: this.vehicleTypeValue,
      User_Type: sessionStorage.getItem('partnerCodeTraceId')
        ? 'Partner'
        : 'Customer',
      Motor_Type: this.vehicleTypeValue,
    });
  }
}
