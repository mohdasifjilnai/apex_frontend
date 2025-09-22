import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
declare const webengage: any;
@Component({
  selector: 'app-check-quotes-dialog',
  templateUrl: './check-quotes-dialog.component.html',
  styleUrls: ['./check-quotes-dialog.component.scss'],
})
export class CheckQuotesDialogComponent implements OnInit {
  vehicleTypeValue: any;
  userType: any;
  insurerData: any;
  constructor(
    public dialogRef: MatDialogRef<CheckQuotesDialogComponent>,
    private sharedDataService: SharedDataService,
    private route: Router,
    public matDialog: WindowRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dataToBottomSheet: any,
    public bottomSheet: MatBottomSheet,
    public bottomSheetRef: MatBottomSheetRef<CheckQuotesDialogComponent>
  ) {
    console.log(data);
    this.insurerData = data['cardData'];
  }

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
    const token = sessionStorage.getItem('token');

    webengage.track('Change_Insurer_Inititaed', {
      User_Type: token != null ? 'Partner' : 'Customer',
      Motor_Type: this.vehicleTypeValue,
      Partner_id: sessionStorage.getItem('partner_code'),
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
          // sessionStorage.setItem('mmv_data', JSON.stringify(mmvListData));
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
      Total_IDV: this.insurerData.premium_details.idv,
      Total_Premium: this.insurerData.premium_details.gross_premium,
      Insurer_Name: this.insurerData.insurer_name,
      Insurer_Logo: this.insurerData.insurer_logo,
      Product_id: this.insurerData?.quote_id,
      'Total_Own_Damage_(A)':
        this.insurerData?.premium_details.od_premium_details.total_od_premium,
      NCB_Discount:
        this.insurerData?.premium_details.od_premium_details.ncb_discount,
      'Third_Party_(B)':
        this.insurerData?.premium_details.tp_premium_details.total_tp_premium,
      // Selected_Addons:
      Total_Addons: this.insurerData?.premium_details?.is_addon_addition,
      'GST_(18%)_(C)':
        this.insurerData?.premium_details.total_gst != 0
          ? this.insurerData?.premium_details.total_gst
          : 0,
      'Total_Premium_(A+B+C)':
        this.insurerData?.premium_details.gross_premium != 0
          ? this.insurerData?.premium_details.gross_premium
          : 0,
      IDV:
        this.insurerData?.premium_details.idv != 0
          ? this.insurerData?.premium_details.idv
          : 0,
      Partner_id: sessionStorage.getItem('partner_code'),
    });
  }
}
