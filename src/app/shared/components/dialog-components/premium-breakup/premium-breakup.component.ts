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
import { Router } from '@angular/router';
import { NonPosPopupComponent } from 'src/app/motor-insurance/non-pos-popup/non-pos-popup.component';
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
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  nonPOSJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NonPosPopupComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };

  thirdParty: any;
  vehicleTypeValue: any;
  isIdvGreaterThan50Lac: any;
  endPath: string;

  constructor(
    public dialogRef: MatDialogRef<PremiumBreakupComponent>,
    private sharedDataService: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<PremiumBreakupComponent>,
    public matDialog: WindowRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public dataToBottomSheet: any,
    public bottomSheet: MatBottomSheet,
    private apiService: ApiService,
    private router: Router
  ) {
    if (data['data'] != null) {
      this.initiateQuotes = data.data;
    } else if (dataToBottomSheet != null) {
      this.initiateQuotes = dataToBottomSheet;
    }
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    this.endPath = lastSegment;
    
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
    let url = `?quote_id=${data.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=premim_breakup`;
    this.sharedDataService.downloadPolicy(url);
  }
  /**
   * Function used for buy Now Button in responsive
   *
   */
  getProposalDetails(quotes_data: any) {
    this.bottomSheetRef.dismiss();
    sessionStorage.setItem('quotes_data', JSON.stringify(quotes_data));
    const transactionId = sessionStorage.getItem('transaction_id');

    if (quotes_data?.premium_details?.idv > 5000000) {
      this.isIdvGreaterThan50Lac = true;
    }
    if (this.isIdvGreaterThan50Lac) {
      this.openNonPOSPopup(null);
    } else {
      this.router.navigate([`/motor/quotes/proposal/${transactionId}`]);
    }
  }

  /**
   * Function used for open non POS Popup
   *
   */
  openNonPOSPopup(objData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }
    const obj: any = {
      modalName: this.nonPOSJSON['modalName'],
      width: this.nonPOSJSON['widthObtained'],
      height: this.nonPOSJSON['heightObtained'],
      classNameObtained: this.nonPOSJSON['classObtained'],
      isOutSideClose: this.nonPOSJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
}
