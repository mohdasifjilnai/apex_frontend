import { Component, Inject, OnInit } from '@angular/core';
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
import { ApiConstants } from 'src/app/api.constant';
@Component({
  selector: 'app-premium-breakup',
  templateUrl: './premium-breakup.component.html',
  styleUrls: ['./premium-breakup.component.scss'],
})
export class PremiumBreakupComponent implements OnInit {
  initiateQuotes: any;
  gstToggleData = true;
  showCard: boolean = false;
  transactionId: any;
  shareQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ShareQuotesComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };

  thirdParty: any;
  vehicleTypeValue: any;

  constructor(
    public dialogRef: MatDialogRef<PremiumBreakupComponent>,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<PremiumBreakupComponent>,
    public matDialog: WindowRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dataToBottomSheet: any,
    public bottomSheet: MatBottomSheet,
    private apiService: ApiService
  ) {
    if (data['data'] != null) {
      this.initiateQuotes = data.data;
    } else if (dataToBottomSheet != null) {
      this.initiateQuotes = dataToBottomSheet;
    }
  }
  ngOnInit(): void {
    let gstValue = sessionStorage.getItem('gstValue');
    if (gstValue) {
      this.gstToggleData = JSON.parse(gstValue);
    }
    this.thirdParty = sessionStorage.getItem('productType');
  }
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
  /**
   * BottomSheet Close
   */
  cancelBreakupPremium(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  /**
   * Share Quotes POP-UP and BottomSheet Open
   */
  shareQuotes() {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: [this.initiateQuotes],
    };
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
      this.bottomSheet.open(ShareQuotesComponent, bottomSheetConfig);
    } else {
      this.dialogRef.close();
      this.openModal([this.initiateQuotes], this.shareQuotesJSON);
    }
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '0';
    }

    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  /**
   * Downloads the premium breakup for the given quote.
   * @param data - The quote data.
   */
  downloadPremiumBreakup(data: any) {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.transactionId = sessionStorage.getItem('transaction_id');

    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.downloadPremiumBreakup}?transaction_id=${this.transactionId}&vehicle_type=${this.vehicleTypeValue}&quote_id=${data.quote_id}`
      )
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
