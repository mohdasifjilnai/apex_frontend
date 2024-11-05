import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetConfig,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ShareQuotesComponent } from '../share-quotes/share-quotes.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';
import { NonPosPopupComponent } from 'src/app/motor-insurance/non-pos-popup/non-pos-popup.component';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { ApiConstants } from 'src/app/api.constant';


@Component({
  selector: 'app-revised-premium-breakup',
  templateUrl: './revised-premium-breakup.component.html',
  styleUrls: ['./revised-premium-breakup.component.scss']
})
export class RevisedPremiumBreakupComponent implements OnInit {
  loader:boolean = false;
  thirdParty:any;
  initiateQuotes: any;
  revisedData:any;
  showCard:any;
  endPath: string;
  showAddons: boolean = false;
  mmv_data: any;
  mmvParseData: any;
  proposalId:any;
  paymentObject:any;
  @ViewChild('myform') myform!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<RevisedPremiumBreakupComponent>,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<RevisedPremiumBreakupComponent>,
    public matDialog: WindowRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dataToBottomSheet: any,
    public bottomSheet: MatBottomSheet,
    private apiService: ApiService,
  ) {
    
    if (data.previous != null && data.revised != null) {
      this.initiateQuotes = data?.previous;
      this.revisedData = data?.revised
    } else if (dataToBottomSheet != null) {
      this.initiateQuotes = dataToBottomSheet?.previous;
      this.revisedData = dataToBottomSheet?.revised ;
    }
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    this.endPath = lastSegment;
    this.proposalId = sessionStorage.getItem('proposal_Id');
   }

  ngOnInit(): void {
    this.thirdParty = sessionStorage.getItem('productType');
    this.mmv_data = sessionStorage.getItem('mmv_data');
    if (this.mmv_data) {
      this.mmvParseData = JSON.parse(this.mmv_data);
    }
  }
 

  showAddonsData() {
    this.showAddons = !this.showAddons;
  }

  proceedToPayment(){
    this.loader = true;
    this.apiService
    .getRequestedResponse(
      `${
        ApiConstants['redirection_payment_getway']
      }${this.proposalId.replace(/['"]+/g, '')}`
    )
    .subscribe(
      (payment_getway_response) => {
        if (payment_getway_response) {
          this.paymentObject = payment_getway_response;
          this.loader = false;
          if (!payment_getway_response.is_html) {
            window.location.href =
              payment_getway_response.url;
          } else {
            let paymentObjectValue =
              this.paymentObject.form.replace(
                '<html><head></head><body>',
                ''
              );
            // </body></html>
            let paymentObjectValueData =
              this.paymentObject.form.replace(
                '</form></body></html>',
                `<input  type='submit'   value=''></form>`
              );
            this.paymentObject.form = paymentObjectValueData;

            this.myform.nativeElement.innerHTML =
              this.paymentObject.form;
            this.myform.nativeElement
              .getElementsByTagName('form')[0]
              .submit();
          }
          this.loader = false;
          if (window.innerWidth <= 999) {
            this.bottomSheetRef.dismiss();
          } else {
            this.dialogRef.close();
          }
        }
      },
      (error) => {
        this.loader = false;
        if (window.innerWidth <= 999) {
          this.bottomSheetRef.dismiss();
        } else {
          this.dialogRef.close();
        }
      }
    );
  }

}
