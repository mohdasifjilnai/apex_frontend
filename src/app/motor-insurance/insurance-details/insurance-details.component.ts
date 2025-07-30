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
import { CheckQuotesDialogComponent } from 'src/app/shared/components/dialog-components/check-quotes-dialog/check-quotes-dialog.component';
import { PremiumBreakupComponent } from 'src/app/shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { ShareQuotesComponent } from 'src/app/shared/components/dialog-components/share-quotes/share-quotes.component';
import { environment } from 'src/environments/environment';
declare const webengage: any;
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
  changeQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: CheckQuotesDialogComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'check-quotes-class',
  };
  showCard: boolean = false;
  quoteData: any;
  mmvData: any;
  reviewURL: boolean = false;
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
  gstValue: any;
  defaultGST: any;
  renewalType: any;
  productType: any;
  url: any;
  showInsurerButton = true;
  downloadLoader: boolean = false;
  mmv_data: any;
  mmvParseData: any;
  proposalPunched: any;
  userType: any;
  mmvFOrmData: any;

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
    this.defaultGST = JSON.parse(sessionStorage.getItem('gstValue') || '{}');
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('partnerCodeTraceId')
      ? sessionStorage.getItem('partnerCodeTraceId')
      : null;
    this.sharedData.getRenewalMmv.subscribe((mmv_data: any) => {
      this.mmvData = mmv_data;
    });
    this.sharedData.getPlanType.subscribe((planType) => {
      if (planType) {
        this.planType = planType;
      }
    });
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    this.planType = JSON.parse(sessionStorage.getItem('planType') || '{}');
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.productType = sessionStorage.getItem('productType');
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
      if (this.addonsValue?.length > 0) {
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
    this.sharedDataService.disableChangeInsurer.subscribe((res) => {
      this.proposalPunched = res;
    });
    this.renewalType = sessionStorage.getItem('renewalType');
    this.route.url.subscribe((segments) => {
      const urlSegments = segments.map((segment) => segment.path);
      this.url = urlSegments[urlSegments.length - 2];
    });
    if (this.renewalType == 'renewal' && this.url == 'proposal') {
      this.showInsurerButton = true;
    } else if (this.renewalType == 'renewal' && this.url != 'proposal') {
      this.showInsurerButton = false;
    } else {
      this.showInsurerButton = true;
    }

    this.mmv_data = sessionStorage.getItem('mmv_data');
    if (this.mmv_data) {
      this.mmvParseData = JSON.parse(this.mmv_data);
    }
    this.sharedData?.sendQuotesADDOnData.subscribe((res) => {
      if (res) {
        this.quoteData = JSON.parse(
          sessionStorage.getItem('quotes_data') || '{}'
        );

        if (this.quoteData) {
          this.addonsValue =
            this.quoteData?.premium_details?.addon_premium_details;
          if (this.addonsValue?.length > 0) {
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
    });
    let mmv_Data: any = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    if (mmv_Data?.form_value) {
      this.mmvFOrmData = mmv_Data?.form_value;
    }
    this.sharedDataService?.insurerDetails?.subscribe((getInsurerDetails) => {
      this.mmvFOrmData =
        getInsurerDetails?.quote_request?.meta_data?.mmv_form_data?.form_value;
    });
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
  openShareModal(quoteData: any) {
    this.openModal([this.quoteData], this.insuranceDetailsJSON, quoteData);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any, cardValue: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
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
        cardData: cardValue,
      },
    };

    this.matDialog.openDialog(obj);
  }
  changeInsurer(quoteData: any) {
    if (this.renewalType == 'renewal') {
      this.openModal('renewal', this.changeQuotesJSON, quoteData);
    } else {
      this.openModal('new', this.changeQuotesJSON, quoteData);
    }
  }
  quotesChange() {
    // sessionStorage.setItem('vehiclePopup', 'true');
    sessionStorage.removeItem('vehiclePopup');
    let insurerApiData = {
      transaction_id: sessionStorage.getItem('transaction_id'),
      insurer_quote_id: sessionStorage.getItem('renewalInsurerQuotesId'),
    };
    this.sharedDataService.quotesDataOnRenewal(insurerApiData);
    this.router.navigate(['quotes']);
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
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
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
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.quotesDetails = sessionStorage.getItem('quotes_data');

    let quotesValue = JSON.parse(this.quotesDetails);
    let url;
    if (quotesValue?.quote_id) {
      url = `?quote_id=${quotesValue?.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=uw_details&transaction_id=${this.quoteData?.transaction_id}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants?.downloadPremiumBreakup}${url}`)
        .subscribe((res: any) => {
          if (res != null) {
            this.downloadButtonShow = true;
            this.downloadUrl = res;
          }
        });
    }
  }

  downloadUnderwritingUrl() {
    window.open(this.downloadUrl);
  }

  /**
   * Downloads the premium breakup for the given quote.
   * @param data - The quote data.
   */

  downloadPremiumBreakup() {
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    if (window.ReactNativeWebView) {
      const url = `${environment['backend_url']}/api/v1/docfetch/download_pdf/?quote_id=${this.quoteData.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=premium_breakup&transaction_id=${this.quoteData.transaction_id}`;
      const apiUrlObject = {
        downloadQuotes: url,
      };
      const messageJSON = JSON.stringify(apiUrlObject);
      window.ReactNativeWebView.postMessage(messageJSON);
    }
    this.downloadLoader = true;
    
    let url = `?quote_id=${this.quoteData.quote_id}&vehicle_type=${this.vehicleTypeValue}&share_type=proposal_form&transaction_id=${this.quoteData?.transaction_id}`;
    this.sharedDataService.downloadPolicy(url);
    this.sharedDataService.downloadBreakupResponse.subscribe(
      (response: any) => {
        if (response) {
          this.downloadLoader = false;
        }
      }
    );
  }
}
