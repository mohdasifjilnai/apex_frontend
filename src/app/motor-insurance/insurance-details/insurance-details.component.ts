import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { PremiumBreakupComponent } from 'src/app/shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { ShareQuotesComponent } from 'src/app/shared/components/dialog-components/share-quotes/share-quotes.component';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.scss'],
})
export class InsuranceDetailsComponent implements OnInit {
  insuranceDetailsJSON: {
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
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  showCard: boolean = false;
  quoteData: any;
  mmvData: any;
  reviewURL: boolean = false;
  gstToggleData: any;
  redirectInsurerData: any;
  mmvItem: any;
  planType: any;
  addonsValue: any;
  selectedAddOns: any;
  addonsList: any = [];
  proposalParam: any;
  vehicleTypeValue: any;
  quotesDetails: any;
  downloadButtonShow = false;
  downloadUrl: any;
  addPremiumWithTp: any;
  constructor(
    public matDialog: WindowRef,

    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private sharedData: SharedDataService,
    private apiservice: ApiService,
    private sharedDataService: SharedDataService
  ) {
    this.route.url.subscribe((segments) => {
      const proposalSegment = segments.find(
        (segment) => segment.path === 'review'
      );
      if (proposalSegment) {
        const proposalValue = proposalSegment.path;
        this.reviewURL = true;
      }
    });
  }

  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    this.planType = JSON.parse(sessionStorage.getItem('planType') || '{}');
    let gstValue = sessionStorage.getItem('gstValue');
    if (gstValue) {
      this.gstToggleData = JSON.parse(gstValue);
    }

    /**
     * subscribe when the redirection is done from Review page on clicking of share button
     */
    this.sharedData?.insurerDetails?.subscribe((res) => {
      if (res) {
        this.quoteData = res?.quote_response;
        this.getVehicleMMVPopup(
          res?.quote_request?.vehicle_type,
          res?.quote_request?.rb_mmv_id
        );
      }
    });
    this.proposalParam = sessionStorage.getItem('proposal_param');
    let mmvData = JSON.parse(sessionStorage.getItem('mmvData') || '{}');
    if (mmvData && Object.keys(mmvData).length > 0) {
      this.mmvItem = mmvData;
    }

    this.sharedData?.redirectInsurerDetails?.subscribe((res) => {
      if (res) {
        this.redirectInsurerData = res;
      }
    });
    this.addonsList = [];

    if (this.quoteData) {
      this.addonsValue = this.quoteData?.premium_details?.addon_premium_details;
      if (this.addonsValue.length > 0) {
        this.addonsList = this.addonsValue;
      }
      // if (
      //   this.quoteData?.premium_details?.addon_premium_details[0]
      //     ?.add_on_name === 'Compulsory Personal Accident'
      // ) {
      //   this.onCpaCheckboxChange(true);
      // } else {
      //   this.onCpaCheckboxChange(false);
      // }
    }
  }

  ngAfterViewInit() {
    this.downloadUnderwriting();
  }
  /**
   * Returns a boolean indicating whether the specified value is a number.
   *
   * @param value - The value to test.
   * @returns `true` if the value is a number, otherwise `false`.
   */

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }
  /**
   * Returns a boolean indicating whether the specified value is a string.
   *
   * @param value - The value to test.
   * @returns `true` if the value is a string, otherwise `false`.
   */
  isString(value: any): boolean {
    return typeof value === 'string';
  }
  openShareModal() {
    this.openModal([this.quoteData], this.insuranceDetailsJSON);
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
  changeInsurer() {
    this.router.navigate(['/motor/quotes']);
  }
  premiumBreakup(quoteData: any) {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: quoteData,
    };
    this.bottomSheet.open(PremiumBreakupComponent, bottomSheetConfig);
  }
  getVehicleMMVPopup(productType: any, mmvId: any) {
    let apiData;
    apiData = `?product_name=${productType}&rb_mmv_id=${mmvId}`;
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res) => {
        this.mmvItem = res;
        sessionStorage.setItem('mmvData', JSON.stringify(res));
      });
  }

  /**
   * Downloads the premium breakup for the given quote.
   * @param data - The quote data.
   */
  downloadUnderwriting() {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.quotesDetails = sessionStorage.getItem('quotes_data');

    let quotesValue = JSON.parse(this.quotesDetails);
    let url = `?quote_id=${quotesValue.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=uw_details`;

    this.apiservice
      .getRequestedResponse(`${ApiConstants?.downloadPremiumBreakup}${url}`)
      .subscribe((res: any) => {
        if (res != null) {
          this.downloadButtonShow = true;
          this.downloadUrl = res;
        }
      });
  }

  downloadUnderwritingUrl() {
    window.open(this.downloadUrl);
  }
  // onCpaCheckboxChange(data: boolean) {
  //   if (data) {
  //     if (
  //       this.quoteData?.premium_details?.addon_premium_details[0]
  //         ?.add_on_name === 'Compulsory Personal Accident'
  //     ) {
  //       this.addPremiumWithTp =
  //         this.quoteData?.premium_details?.addon_premium_details[0]
  //           ?.add_on_premium +
  //         this.quoteData?.premium_details?.tp_premium_details?.basic_tp_premium;
  //     }
  //   } else {
  //     this.addPremiumWithTp =
  //       this.quoteData?.premium_details?.tp_premium_details?.basic_tp_premium;
  //     console.log(this.addPremiumWithTp, 'shivam');
  //   }
  // }
  // onCpaChange(event: any) {
  //   this.onCpaCheckboxChange(event.checked);
  // }\

  /**
   * Downloads the premium breakup for the given quote.
   * @param data - The quote data.
   */

  downloadPremiumBreakup() {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    let url = `?quote_id=${this.quoteData.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=premium_breakup`;
    this.sharedDataService.downloadPolicy(url);
  }
}
