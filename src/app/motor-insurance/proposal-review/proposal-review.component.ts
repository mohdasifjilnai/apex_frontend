import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ErrorDialogComponent } from 'src/app/shared/components/dialog-components/error-dialog/error-dialog.component';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
import { OtpComponent } from 'src/app/shared/components/dialog-components/otp/otp.component';
import { ReviewAddonsComponent } from 'src/app/shared/components/dialog-components/review-addons/review-addons.component';
import { TermsComponent } from 'src/app/shared/components/dialog-components/terms/terms.component';
import { ProposalShareComponent } from 'src/app/shared/components/proposal-share/proposal-share.component';
import { environment } from 'src/environments/environment';
declare const webengage: any;
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

  failureJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ErrorDialogComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
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
  @ViewChild('myform') myform!: ElementRef;
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
  is_cse: any;
  employee_code: any;
  cse: any;
  partner_code: any;
  partnerCodewithTraceId: any;
  consentSubmitButton = false;
  proposalId: any;
  paymentObject: any;
  loader: boolean = false;
  constructor(
    private route: Router,
    private shareData: SharedDataService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {
    window.addEventListener('load', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    this.renewalType = sessionStorage.getItem('renewalType');
    let productTypeValue = sessionStorage.getItem('productType');
    this.is_cse = sessionStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = sessionStorage.getItem('employee_code');
    this.partner_code = sessionStorage.getItem('partner_code');
    if (this.partnerCodewithTraceId?.partner_code) {
      this.partner_code = this.partnerCodewithTraceId?.partner_code;
    }
    this.shareData.partnerCodeFromApiRes.subscribe((res) => {
      if (res) {
        this.partner_code = res;
      }
    });
    let previousPolicyType = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );
    if (
      previousPolicyType?.policy_expiry === 'saod' ||
      previousPolicyType?.policy_expiry === 'bundle'
    ) {
      this.isTpDetailsDisabled = true;
      this.isOdDetailsShow = true;
    } else if (previousPolicyType?.policy_expiry === 'comprehensive') {
      this.isTpDetailsDisabled = true;
      this.isOdDetailsShow = false;
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
    let proposal_punched = sessionStorage.getItem('proposal_punched');
    if (!proposal_punched) {
      if (this.proposalData) {
        this.route.navigate([
          `quotes/proposal/${this.proposalData?.quote_response?.transaction_id}`,
        ]);
        this.shareData.sendProposalReviewEditId(titleName);
      } else {
        this.route.navigate([`quotes/proposal/${this.transactionId}`]);
        this.shareData.sendProposalReviewEditId(titleName);
      }
    } else {
      this.shareData.openSnackBar('Proposal Already Created ', true, 3000);
    }
  }
  back() {
    this.route.navigate([`quotes/proposal/${this.transactionId}`]);
  }
  submitReview() {
    const vehcileType = sessionStorage.getItem('vehicleType');
    // webengage.track('Motor_Vehicle_details_submitted', {
    //   User_Type: sessionStorage.getItem('partner_code')
    //     ? 'Partner'
    //     : 'Customer',
    //   Motor_Type: vehcileType,
    // });
    if (this.preAddons?.is_consent) {
      this.shareData.createProposalId();
    }
    this.loader = true;
    // this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    // if (window.innerWidth <= 999) {
    //   const bottomSheetConfig: MatBottomSheetConfig = {
    //     data: [this.quoteData],
    //   };
    //   this.bottomSheet.open(ProposalShareComponent, bottomSheetConfig);
    //   this.shareData.setPreviousPolicyDetails(this.proposalDataSend);
    // } else {
    //   this.openModal([this.quoteData], this.insuranceDetailsJSON);
    // }
    console.log(this.generateProposalData, 'krishna');
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.generate_proposal}?insurer_code=${this.generateProposalData?.insurer_code}&proposal_id=${this.generateProposalData?.proposal_id}`
      )
      .subscribe(
        (generatedProposal: any) => {
          if (generatedProposal.status) {
            sessionStorage.setItem('proposal_punched', 'true');
            this.shareData.disabledChangeInsurerButton(true);
            if (generatedProposal.is_breakin || generatedProposal?.is_payd) {
              this.loader = false;

              this.route.navigate([
                `quotes/proposal/${this.transactionId}/review/inspection`,
              ]);
            } else {
              this.loader = false;
              if (window.innerWidth <= 999) {
                const bottomSheetConfig: MatBottomSheetConfig = {
                  data: [this.quoteData],
                };
                this.bottomSheet.open(
                  ProposalShareComponent,
                  bottomSheetConfig
                );
                this.shareData.setPreviousPolicyDetails(this.proposalDataSend);
              } else {
                this.openModal([this.quoteData], this.insuranceDetailsJSON);
              }
            }
          } else {
            this.loader = false;
            if (
              this.generateProposalData?.insurer_code == 'digit' &&
              generatedProposal.ckyc_link
            ) {
              this.failureJSON['modalName'] = ErrorDialogComponent;
              this.openFailurePopup(generatedProposal);
            } else {
              this.failureJSON['modalName'] = FailureDialogComponent;
              this.openFailurePopup(generatedProposal);
            }
          }
        },
        (error) => {}
      );
  }
  checkQuotes() {
    this.openModal('renewal', this.checkQuotesJson);
  }
  openFailurePopup(objData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }
    const obj: any = {
      modalName: this.failureJSON['modalName'],
      width: this.failureJSON['widthObtained'],
      height: this.failureJSON['heightObtained'],
      classNameObtained: this.failureJSON['classObtained'],
      isOutSideClose: this.failureJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 999) {
      resWidth = 'auto';
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
          this.proposalId = this.generateProposalData?.proposal_id;
          if (this.generateProposalData?.proposal_punched) {
            sessionStorage.setItem('proposal_punched', 'true');
            this.shareData.disabledChangeInsurerButton(true);
          }
          sessionStorage.setItem(
            'previous_insurerCode',
            JSON.stringify(this.generateProposalData?.insurer_code)
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
            const dataToStore = {
              transaction_id: this.generateProposalData?.transaction_id,
              insurer_quote_id: this.generateProposalData?.insurer_quote_id,
            };

            sessionStorage.setItem(
              'sharable_transactionData',
              JSON.stringify(dataToStore)
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
    if (this.consentSubmitButton) {
      if (this.isAcknowledged && this.isAcknowledgedConsent) {
        this.isButtonEnabled = true;
      }
      // else if(this.isAcknowledged && !this.preAddons?.is_consent){
      //   this.isButtonEnabled = true;
      // }
      else if (this.isAcknowledged && !this.isAcknowledgedConsent) {
        this.isButtonEnabled = false;
      } else {
        this.isButtonEnabled = false;
      }
    } else {
      if (this.isAcknowledged) {
        this.isButtonEnabled = true;
      } else {
        this.isButtonEnabled = false;
      }
    }
    // if (
    //   (this.isAcknowledged && this.isAcknowledgedConsent) ||
    //   (!this.isAcknowledged &&
    //     !this.isAcknowledgedConsent &&
    //     this.isAcknowledged !== this.isAcknowledgedConsent) ||
    //   (this.isAcknowledged &&
    //     !this.isAcknowledgedConsent &&
    //     !this.preAddons?.is_consent) ||
    //   (!this.isAcknowledged &&
    //     this.isAcknowledgedConsent &&
    //     !this.preAddons?.is_consent)
    // ) {
    //   if (!this.consentSubmitButton) {
    //     this.isButtonEnabled = true;
    //   }
    // } else {
    //   this.isButtonEnabled = false;
    // }
  }

  getInsurerCode(transaction_id: any, insurer_quote_id: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${transaction_id}/${insurer_quote_id}`
      )
      .subscribe((response) => {
        if (response) {
          const insurers = [
            'future',
            'liberty',
            'universal_sompo',
            'hdfc_ergo',
            'royal_sundaram',
            'magma',
          ];
          if (insurers.includes(response?.quote_response?.insurer_code)) {
            this.consentSubmitButton = true;
            this.getPrevPolicyDetails(response);
          } else {
            this.consentSubmitButton = false;
          }
          let renewalTypeData = response?.quote_request?.is_rb_renewal;
          if (renewalTypeData) {
            sessionStorage.setItem('renewalType', 'renewal');
          }
          if (response?.quote_request?.vehicle_type) {
            sessionStorage.setItem(
              'vehicleType',
              response?.quote_request?.vehicle_type
            );
          }
          if (response?.quote_request?.registration_no != null) {
            let registartionNumber = response?.quote_request?.registration_no;
            sessionStorage.setItem('registrationNumber', registartionNumber);
          }

          if (response?.quote_request?.partner_code != null) {
            sessionStorage.setItem(
              'partner_code',
              response?.quote_request?.partner_code
            );
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.first_name != null
            ) {
              sessionStorage.setItem(
                'first_name',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.first_name
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.last_name != null
            ) {
              sessionStorage.setItem(
                'last_name',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.last_name
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.middle_name != null
            ) {
              sessionStorage.setItem(
                'middle_name',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.middle_name
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.token != null
            ) {
              sessionStorage.setItem(
                'token',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.token
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.employee_code != null
            ) {
              sessionStorage.setItem(
                'employee_code',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.employee_code
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.is_cse != null
            ) {
              sessionStorage.setItem(
                'is_cse',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.is_cse
              );
            }
            if (
              response?.quote_request.meta_data.mmv_form_data?.partner_details
                ?.pos_status != null
            ) {
              sessionStorage.setItem(
                'pos_status',
                response?.quote_request.meta_data.mmv_form_data?.partner_details
                  ?.pos_status
              );
            }
          }
          if (response?.quote_request?.trace_id) {
            let traceId = {
              trace_id: response?.quote_request?.trace_id,
              partner_code: response?.quote_request?.partner_code,
            };
            sessionStorage.setItem(
              'partnerCodeTraceId',
              JSON.stringify(traceId)
            );
            this.shareData.partnerCode(response?.quote_request?.partner_code);
          }
          if (
            response?.quote_request?.meta_data?.selectedAddons !== 'undefined'
          ) {
            let addonsValue = JSON.parse(
              response?.quote_request?.meta_data?.selectedAddons
            );

            sessionStorage.setItem(
              'selectedAddons',
              JSON.stringify(addonsValue)
            );
          } else {
            sessionStorage.setItem('selectedAddons', JSON.stringify(undefined));
          }
          sessionStorage.setItem(
            'lastSelectedTabIndex',
            response?.quote_request?.meta_data?.selectedTabIndex
          );
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
        this.shareData.quotesADDOnData(JSON.stringify(quoteResponseToStore));
      }

      const newVehicleType = this.proposalData?.quote_request?.business_type;
      if (newVehicleType) {
        sessionStorage.setItem('newVehicleType', newVehicleType);
      }

      const proposerType = this.proposalData?.quote_request?.customer_type;
      if (proposerType) {
        sessionStorage.setItem('proposerType', proposerType);
      }
      const kycData: any = {
        verification_status:
          this.generateProposalData?.ckyc_details?.is_verification,
        proposer_type:
          this.generateProposalData?.customer_details?.customer_type,
        insurer_code: this.generateProposalData?.insurer_code,
      };
      if (kycData) {
        sessionStorage.setItem('kycData', JSON.stringify(kycData));
      }

      const productType = this.proposalData?.quote_request?.product_type;
      if (productType) {
        sessionStorage.setItem('productType', productType);
      }
      const mmv_data =
        this.proposalData?.quote_request?.meta_data?.mmv_form_data;
      let previousPolicyType;
      if (mmv_data) {
        // Store mmv_data object in session storage
        sessionStorage.setItem('mmv_data', JSON.stringify(mmv_data));
        previousPolicyType = JSON.parse(
          sessionStorage.getItem('mmv_data') || '{}'
        );
        if (
          previousPolicyType?.policy_expiry === 'saod' ||
          previousPolicyType?.policy_expiry === 'bundle'
        ) {
          this.isTpDetailsDisabled = true;
          this.isOdDetailsShow = true;
        } else if (previousPolicyType?.policy_expiry === 'comprehensive') {
          this.isTpDetailsDisabled = true;
          this.isOdDetailsShow = false;
        } else if (
          previousPolicyType?.policy_expiry === 'satp' ||
          previousPolicyType?.policy_expiry === 'bundled_tp'
        ) {
          this.isTpDetailsDisabled = true;
        }
      }
      this.shareData.sendRenewalMmv(mmv_data);
      let policyExpiryDate = '';
      if (this.proposalData?.quote_request.previous_policy_exp_date) {
        policyExpiryDate =
          this.proposalData?.quote_request.previous_policy_exp_date;
      }

      this.apiService
        .getRequestedResponse(
          `${ApiConstants.getCoverageType()}?reg_year=${
            this.proposalData?.quote_request?.registration_year
          }&vehicle_type=${
            this.proposalData?.quote_request?.vehicle_type
          }&previous_policy_type=${
            previousPolicyType?.policy_expiry
          }&previous_policy_expiry_date=${policyExpiryDate}`
        )
        .subscribe((res: any) => {
          if (res) {
            for (let coverage of res) {
              if (
                coverage?.code ===
                this.proposalData?.quote_request?.product_type
              ) {
                this.shareData.sendPlanType(coverage);
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
    let diesel: any;
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
        `${ApiConstants.pre_policy_addons}?insurer_code=${getInsurerData?.quote_response?.insurer_code}&vehicle_type=${getInsurerData?.quote_request?.vehicle_type}&business_type=${getInsurerData?.quote_request?.business_type}&proposer_type=${getInsurerData?.quote_request?.customer_type}&product_type=${getInsurerData?.quote_request?.product_type}&in_diesel=${diesel}&insurer_quote_id=${getInsurerData?.quote_response?.quote_id}`
      )
      .subscribe((res: any) => {
        this.preAddons = res;
        if (this.preAddons?.is_consent) {
          this.isButtonEnabled = false;
        } else {
          this.isAcknowledgedConsent = true;
          if (this.isAcknowledged) {
            this.isButtonEnabled = true;
          }
        }
        this.shareData.sendPrevAddon(res);
      });
  }
}
