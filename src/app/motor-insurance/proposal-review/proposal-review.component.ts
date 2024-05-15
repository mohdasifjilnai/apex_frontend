import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { CheckQuotesDialogComponent } from 'src/app/shared/components/dialog-components/check-quotes-dialog/check-quotes-dialog.component';
import { OtpComponent } from 'src/app/shared/components/dialog-components/otp/otp.component';
import { ReviewAddonsComponent } from 'src/app/shared/components/dialog-components/review-addons/review-addons.component';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';
import { ProposalShareComponent } from 'src/app/shared/components/proposal-share/proposal-share.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-proposal-review',
  templateUrl: './proposal-review.component.html',
  styleUrls: ['./proposal-review.component.scss'],
})
export class ProposalReviewComponent implements OnInit {
  insuranceDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ProposalShareComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '1%',
    isOutSideClose: true,
    classObtained: 'insurance-details-class',
  };
  renewalAddonsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ReviewAddonsComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '5%',
    isOutSideClose: true,
    classObtained: 'addons-renewal-class',
  };
  termsAndConditionJson: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: TermsComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '1%',
    isOutSideClose: true,
    classObtained: 'terms-class',
  };
  checkQuotesJson: {
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
    topObtained: '10%',
    isOutSideClose: true,
    classObtained: 'check-quotes-class',
  };
  quoteData: any;
  generateProposalData: any;
  transactionId: any;
  vehicleType: any;
  isTpDetailsDisabled: boolean = false;
  isAcknowledged: boolean = false;
  isAcknowledgedConsent: boolean = false;
  isButtonEnabled: boolean = false;
  proposalParam: any;
  transaction_Id: any;
  proposalData: any;
  proposalDataSend: any;
  renewalType: any;
  renewalInsurerQuotesId: any;
  proposalType: any;
  manufactureDate: any;
  preAddons: any;
  isOdDetailsShow: boolean = false;
  manufacturemonth: any;
  manufactureYear: any;
  modifiedManufactureValue: any;
  constructor(
    private route: Router,
    private shareData: SharedDataService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    this.renewalType = sessionStorage.getItem('renewalType');
    let productTypeValue = sessionStorage.getItem('productType');
    let previousPolicyType = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );
    if (
      previousPolicyType?.policy_expiry === 'saod' ||
      previousPolicyType?.policy_expiry === 'comprehensive' ||
      previousPolicyType?.policy_expiry === 'bundle'
    ) {
      this.isTpDetailsDisabled = true;
      this.isOdDetailsShow = true;
    } else if (
      previousPolicyType?.policy_expiry === 'satp' ||
      previousPolicyType?.policy_expiry === 'bundled_tp'
    ) {
      this.isTpDetailsDisabled = true;
    }
    this.router.queryParams.subscribe((params) => {
      this.proposalParam = params['proposal'] === 'true';
      sessionStorage.setItem(
        'proposal_param',
        JSON.stringify(this.proposalParam)
      );
      this.router.url.subscribe((segments) => {
        const urlSegments = segments.map((segment) => segment.path);
        this.transaction_Id = urlSegments[urlSegments.length - 2];
        this.generateProposal(this.transaction_Id);
      });
    });
    let isFirstCall = true;

    this.shareData.getProposalDetails.subscribe((proposal) => {
      if (proposal?.previous_policy_details !== null && isFirstCall) {
        proposal.previous_policy_details.is_consent =
          this.isAcknowledgedConsent;
        this.shareData.createProposalId(
          'proposal_review',
          proposal?.previous_policy_details
        );
        isFirstCall = false;
      }
    });
    this.getInsurerDetailsOnRedirection();

    this.proposalType = sessionStorage.getItem('proposerType');
  }
  navigateToUrl(titleName: string) {
    if (this.proposalData) {
      this.route.navigate([
        `/motor/quotes/proposal/${this.proposalData?.quote_response?.transaction_id}`,
      ]);
    } else {
      this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
      this.shareData.sendProposalReviewEditId(titleName);
    }
  }
  back() {
    this.route.navigate([`/motor/quotes/proposal/${this.transactionId}`]);
  }
  submitReview() {
    if (this.generateProposalData?.previous_policy_details?.is_consent) {
      this.shareData.createProposalId();
    }
    if (window.innerWidth <= 999) {
      const bottomSheetConfig: MatBottomSheetConfig = {
        data: [this.quoteData], // Pass your data here
      };
      this.bottomSheet.open(ProposalShareComponent, bottomSheetConfig);
      this.shareData.setPreviousPolicyDetails(this.proposalDataSend);
    } else {
      this.openModal([this.quoteData], this.insuranceDetailsJSON);
    }
  }
  checkQuotes() {
    this.openModal('data', this.checkQuotesJson);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 999) {
      resWidth = '95%';
      resTop = jsonData['topObtained'];
    } else {
      resWidth = 'auto';
      resTop = jsonData['topObtained'];
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
  openDialog(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(TermsComponent);
    } else {
      this.openModal('', this.termsAndConditionJson);
    }
  }
  generateProposal(transactionId?: any) {
    if (transactionId) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.get_proposal}/?transaction_id=${transactionId}`
        )
        .subscribe((res) => {
          this.generateProposalData = res;
          sessionStorage.setItem(
            'proposal_Id',
            JSON.stringify(this.generateProposalData?.proposal_id)
          );
          let manufactureDateValue =
            this.generateProposalData?.vehicle_details?.manufacture_date;
          let [day, month, year] = manufactureDateValue.split('/');
          let reformattedDate = `${month}/${day}/${year}`;
          let modifiedManufactureDate = new Date(reformattedDate);
          this.manufacturemonth = moment(month, 'MM').format('MMM');
          this.manufactureYear = moment(modifiedManufactureDate).year();
          this.modifiedManufactureValue =
            this.manufacturemonth + '-' + this.manufactureYear;

          const dataToSend = [
            res?.previous_policy_details, //Previous Policy Details
            res?.proposal_number, //Proposal Number
            res, //Proposal Details
            this.quoteData, //Quotes Details Data
          ];
          this.proposalDataSend = dataToSend;
          this.shareData.setPreviousPolicyDetails(this.proposalDataSend);
          this.shareData?.setRedirectDataForInsurer(res);
          if (res) {
            this.renewalInsurerQuotesId =
              this.generateProposalData?.insurer_quote_id;
            sessionStorage.setItem(
              'renewalInsurerQuotesId',
              this.renewalInsurerQuotesId
            );
            this.getInsurerCode(
              this.generateProposalData?.transaction_id,
              this.generateProposalData?.insurer_quote_id
            );
            const kycData = JSON.parse(
              sessionStorage.getItem('kycData') || '{}'
            );
            if (!kycData) {
              const kycDataToStore = {
                verification_status: res?.ckyc_details?.is_verification,
                insurer_code: res?.insurer_code,
                proposer_type: res?.customer_details?.customer_type,
              };
              const kycDataToStoreString = JSON.stringify(kycDataToStore);

              sessionStorage.setItem('kycData', kycDataToStoreString);
            }
          }
        });
    }
  }
  updateCheckBoxState(checked: boolean): void {
    this.isAcknowledged = checked;
    this.updateButtonState();
  }

  updateCheckBoxIsConsent(checked: boolean): void {
    this.isAcknowledgedConsent = checked;
    this.updateButtonState();
  }

  updateButtonState(): void {
    if (
      (this.isAcknowledged && this.isAcknowledgedConsent) ||
      (!this.isAcknowledged &&
        !this.isAcknowledgedConsent &&
        this.isAcknowledged !== this.isAcknowledgedConsent) ||
      (this.isAcknowledged &&
        !this.isAcknowledgedConsent &&
        !this.generateProposalData?.previous_policy_details?.is_consent) ||
      (!this.isAcknowledged &&
        this.isAcknowledgedConsent &&
        !this.generateProposalData?.previous_policy_details?.is_consent)
    ) {
      this.isButtonEnabled = true;
    } else {
      this.isButtonEnabled = false;
    }
  }

  getInsurerCode(transaction_id: any, insurer_quote_id: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${transaction_id}/${insurer_quote_id}`
      )
      .subscribe((response) => {
        if (response) {
          if (this.generateProposalData?.previous_policy_details?.is_consent) {
            this.getPrevPolicyDetails(response);
          }
          this.shareData.getInsurerDetail(response);
        }
      });
  }
  /**
   * Subscribes to the insurer details observable and stores the data in the component's state.
   * This function is used to retrieve the insurer details from the backend and store them in the component's state.
   * The insurer details are retrieved by subscribing to the insurer details observable and storing the data in the component's state.
   **/
  getInsurerDetailsOnRedirection() {
    this.shareData.insurerDetails?.subscribe((res) => {
      this.proposalData = res;

      const transactionId = this.proposalData?.quote_response?.transaction_id;
      if (transactionId) {
        sessionStorage.setItem('transaction_id', transactionId);
      }

      const quoteResponseToStore = this.proposalData?.quote_response;
      if (quoteResponseToStore) {
        sessionStorage.setItem(
          'quotes_data',
          JSON.stringify(quoteResponseToStore)
        );
      }

      const newVehicleType = this.proposalData?.quote_request?.business_type;
      if (newVehicleType) {
        sessionStorage.setItem('newVehicleType', newVehicleType);
      }

      const proposerType = this.proposalData?.quote_request?.customer_type;
      if (proposerType) {
        sessionStorage.setItem('proposerType', proposerType);
      }

      const productType = this.proposalData?.quote_request?.product_type;
      if (productType) {
        sessionStorage.setItem('productType', productType);
      }
      const mmv_data =
        this.proposalData?.quote_request?.meta_data?.mmv_form_data;
      if (mmv_data) {
        // Store mmv_data object in session storage
        sessionStorage.setItem('mmv_data', JSON.stringify(mmv_data));
      }
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.getCoverageType}?reg_year=${this.proposalData?.quote_request?.registration_year}&vehicle_type=${this.proposalData?.quote_request?.vehicle_type}`
        )
        .subscribe((res: any) => {
          if (res) {
            for (let coverage of res) {
              if (
                coverage?.code ===
                this.proposalData?.quote_request?.product_type
              ) {
                sessionStorage.setItem('planType', JSON.stringify(coverage));
              }
            }
          }
        });
    });
  }
  showAddons() {
    if (this.preAddons) {
      if (window.innerWidth <= 999) {
        this.bottomSheet.open(ReviewAddonsComponent);
      } else {
        this.openModal('data', this.renewalAddonsJSON);
      }
    }
  }
  getPrevPolicyDetails(getInsurerData: any) {
    const quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    let diesel;
    if (
      getInsurerData?.quote_request?.meta_data?.mmv_form_data?.vehicle_fuel ==
      'DIESEL'
    ) {
      diesel = true;
    } else {
      diesel = false;
    }
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.pre_policy_addons}?insurer_code=${quoteData?.insurer_code}&vehicle_type=${getInsurerData?.quote_request?.vehicle_type}&business_type=${getInsurerData?.quote_request?.business_type}&proposer_type=${getInsurerData?.quote_request?.customer_type}&product_type=${getInsurerData?.quote_request?.product_type}&in_diesel=${diesel}`
      )
      .subscribe((res: any) => {
        this.preAddons = res;
        this.shareData.sendPrevAddon(res);
      });
  }
}
