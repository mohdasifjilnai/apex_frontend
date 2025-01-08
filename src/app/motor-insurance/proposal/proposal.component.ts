import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from 'src/app/core/services/loader.service';

declare var HyperKYCModule: any;
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {
  fetchCkycData: any;
  proceedData: any;
  panelOpenState = false;
  isCkycLoaded: boolean = false;
  showVehicleOwnerDetails: boolean = false;
  showNomineeDetails: boolean = false;
  showVehicleDetails: boolean = false;
  showPreviousPolicyDetails: boolean = false;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  kycPending: any;
  isMobileView: boolean = false;
  proposalDetails: any;
  proposerType: any;
  isNotShowNomineeDetails: boolean = false;
  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('previousPolicyDetailsPanel', { read: ElementRef })
  previousPolicyDetailsPanel!: ElementRef;
  @ViewChild('vehilceOwnerPanel', { read: ElementRef })
  vehilceOwnerPanel!: ElementRef;
  @ViewChild('nomineDetailsPanel', { read: ElementRef })
  nomineDetailsPanel!: ElementRef;
  @ViewChild('vehicleDetailPanel', { read: ElementRef })
  vehicleDetailPanel!: ElementRef;
  fethedCkycData: boolean = false;
  vehicleType: any;
  isNotShowInNewPolicyDetails: boolean = true;
  accordianExpanded: string = 'ckyc';
  quoteData: any;
  reviewData: any;
  productTypeValue: any;
  stepNumber: any = 'Step 1/5';
  stepHeader: any = 'CKYC Details';
  stepImage: any = '/assets/icon/step-1.svg';
  mmvData: any;
  isLoadVehicleOwnerDetails: boolean = false;
  isLoadNomineeDetails: boolean = false;
  isLoadVehicleDetails: boolean = false;
  isLoadPreviousPolicyDetails: boolean = false;
  vehicleInspectionMessage: any;
  vehicleCardData: any;
  breakIn: boolean = false;
  insuranceVehicleType: any;
  currentStepIndex: number = 0;
  unitedTokenValue: any;
  decodedString: any;
  renewalDetails: any;
  proposalId: any;
  previous_insurer: any;
  getInsurerData: any;
  vehicleMMVData: any;
  rtoCity: any;
  isLoading: boolean = false;
  is_cse: any;
  employee_code: any;
  cse: any;
  partner_code: any;
  transactionId: any;
  expiryListData: any;
  allNCBData: any;
  mmvStoreData: any;
  partnerCodeTraceId: any;
  partnerCodewithTraceId: any;
  isPrevoiusInsurer: any;

  constructor(
    public matDialog: WindowRef,
    private sharedData: SharedDataService,
    private router: Router,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private route: ActivatedRoute
  ) {
    window.addEventListener('load', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.is_cse = sessionStorage.getItem('is_cse')?.toLowerCase();
    this.employee_code = sessionStorage.getItem('employee_code');
    this.partner_code = sessionStorage.getItem('partner_code');
    if (this.partnerCodewithTraceId?.partner_code) {
      this.partner_code = this.partnerCodewithTraceId?.partner_code;
    }
    this.sharedData.partnerCodeFromApiRes.subscribe((res) => {
      if (res) {
        this.partner_code = res;
      }
    });
    let quoteRequesId = sessionStorage.getItem('quote_request_id');
    if (quoteRequesId) {
      sessionStorage.removeItem('quote_request_id');
    }
    let currentUrl = sessionStorage.getItem('current_url');
    if (currentUrl) {
      sessionStorage.removeItem('current_url');
    }
    this.renewalDetails = sessionStorage.getItem('renewalDetails');
    const parsedRenewalDetails = JSON.parse(this.renewalDetails);
    if (parsedRenewalDetails) {
      this.loaderService.show();
      sessionStorage.setItem(
        'proposal_Id',
        parsedRenewalDetails?.transactional_details?.proposal_id
      );
      this.getInsurerCode(
        parsedRenewalDetails?.transactional_details?.transaction_id,
        parsedRenewalDetails?.transactional_details?.quote_id
      );
    } else {
      this.quoteData = JSON.parse(
        sessionStorage.getItem('quotes_data') || '{}'
      );
      // const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
      // if (kycData?.insurer_code === this.quoteData['insurer_code']) {
      //   this.sharedData?.getAddressValidation(this.quoteData?.insurer_code);
      // }
      if (Object.keys(this.quoteData).length > 0) {
        const renewalType = sessionStorage.getItem('renewalType');
        if (renewalType == 'renewal') {
          this.isPrevoiusInsurer = true;
          sessionStorage.setItem('isprevoiusInsurer', this.isPrevoiusInsurer);
        }
        if (sessionStorage.getItem('newVehicleType') != 'new' && !renewalType) {
          this.getVahaanDetails(sessionStorage.getItem('registrationNumber'));
        }
        this.sharedData?.getAddressValidation(this.quoteData?.insurer_code);
        const BuyNowClick = sessionStorage.getItem('BuyNowClick');
        if (!BuyNowClick) {
          this.getInsurerQuoteId(this.quoteData?.transaction_id);
        } else {
          this.sharedData.createProposalId();
        }
      } else {
        this.route.url.subscribe((segments) => {
          const urlSegments = segments.map((segment) => segment.path);
          const transactionId = urlSegments[urlSegments.length - 1];
          this.getInsurerQuoteId(transactionId);
        });
      }
    }

    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    // if (kycData?.insurer_code === this.quoteData['insurer_code']) {
    // this.sharedData?.getAddressValidation(this.quoteData?.insurer_code);
    // }
    this.kycPending = kycData;
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    this.insuranceVehicleType = sessionStorage.getItem('vehicleType');
    this.productTypeValue = sessionStorage.getItem('productType');
    this.vehicleCardData = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );
    this.sharedData?.getProposalReviewDetails?.subscribe((reviewDetails) => {
      this.reviewData = reviewDetails;
    });
    if (this.vehicleType === 'new') {
      this.isNotShowInNewPolicyDetails = false;
    }
    this.proposerType = sessionStorage.getItem('proposerType');
    if (this.quoteData?.premium_details?.addon_premium_details?.length > 0) {
      for (let isCpa of this.quoteData?.premium_details
        ?.addon_premium_details) {
        if (
          (isCpa?.add_on_code === 'CPA' ||
            isCpa?.add_on_code === 'CPA3' ||
            isCpa?.add_on_code === 'CPA5') &&
          this.proposerType !== 'corporate'
        ) {
          this.isNotShowNomineeDetails = true;
        }
      }
    } else if (this.proposerType === 'corporate') {
      this.isNotShowNomineeDetails = false;
    } else {
      this.isNotShowNomineeDetails = false;
    }
    this.getProposalDataForPatch();
    if (window.innerWidth <= 999) {
      this.isMobileView = true;
    }
    if (this.isNotShowNomineeDetails && this.isNotShowInNewPolicyDetails) {
      this.stepNumber = 'Step 1/5';
    } else if (this.isNotShowNomineeDetails) {
      this.stepNumber = 'Step 1/4';
    } else if (this.isNotShowInNewPolicyDetails) {
      this.stepNumber = 'Step 1/4';
    } else {
      this.stepNumber = 'Step 1/3';
    }

    if (
      this.quoteData['status'] &&
      this.quoteData['is_breakin'] &&
      this.vehicleCardData?.policy_expiry_date != 'Not Sure'
    ) {
      this.vehicleInspectionMessage =
        'Attention!! Some insurance company will ask for an inspection as previous policy is expired';
      this.breakIn = true;
    } else if (
      this.quoteData['status'] &&
      this.quoteData['is_breakin'] &&
      this.vehicleCardData?.policy_expiry_date == 'Not Sure'
    ) {
      this.vehicleInspectionMessage =
        'Attention!! Some insurance company will ask for an inspection as previous policy date is not available.';
      this.breakIn = true;
    }
    // if (this.quoteData?.insurer_code == 'united_india') {
    //   this.sharedData.getProposalDetails.subscribe((proposal) => {
    //     if (proposal) {
    //       this.proposalId = proposal?.proposal_id;
    //       if (!proposal?.ckyc_details?.is_verification) {
    //         this.getUnitedCkycToken();
    //       }
    //       this.isNotShowCkycDetails = false;
    //       this.showVehicleOwnerDetails = true;
    //       this.accordianExpanded = 'vehicleOwnerDetails';
    //       this.openDesiredStep(this.accordianExpanded);
    //       if (
    //         proposal.customer_details !== null &&
    //         !this.isNotShowNomineeDetails
    //       ) {
    //         if (this.reviewData === 'vehilceOwnerPanel') {
    //           this.showVehicleDetails = true;
    //           this.accordianExpanded = 'vehicleOwnerDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else {
    //           if (this.kycPending?.redirection_url_via_form) {
    //             this.sharedData.vehicleOwnerForm.subscribe((res) => {
    //               if (res) {
    //                 this.showVehicleDetails = true;
    //                 this.accordianExpanded = 'vehicleDetails';
    //                 this.openDesiredStep(this.accordianExpanded);
    //               }
    //             });
    //           } else {
    //             this.showVehicleDetails = true;
    //             this.accordianExpanded = 'vehicleDetails';
    //             this.openDesiredStep(this.accordianExpanded);
    //           }
    //         }
    //       } else if (
    //         proposal.customer_details !== null &&
    //         this.isNotShowNomineeDetails
    //       ) {
    //         if (this.reviewData === 'vehilceOwnerPanel') {
    //           this.showNomineeDetails = true;
    //           this.showVehicleOwnerDetails = true;
    //           this.accordianExpanded = 'vehicleOwnerDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else {
    //           if (this.kycPending?.redirection_url_via_form) {
    //             this.sharedData.vehicleOwnerForm.subscribe((res) => {
    //               if (res) {
    //                 this.showNomineeDetails = true;
    //                 this.showVehicleOwnerDetails = true;
    //                 this.accordianExpanded = 'nomineeDetails';
    //                 this.openDesiredStep(this.accordianExpanded);
    //               }
    //             });
    //           } else {
    //             this.showNomineeDetails = true;
    //             this.showVehicleOwnerDetails = true;
    //             this.accordianExpanded = 'nomineeDetails';
    //             this.openDesiredStep(this.accordianExpanded);
    //           }
    //         }
    //       }
    //       if (proposal.nominee_details !== null) {
    //         if (this.reviewData === 'nomineDetailsPanel') {
    //           this.showVehicleDetails = true;
    //           this.accordianExpanded = 'nomineeDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else {
    //           this.showVehicleDetails = true;
    //           this.accordianExpanded = 'vehicleDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         }
    //       }
    //       if (proposal.vehicle_details !== null && this.vehicleType === 'new') {
    //         if (this.reviewData === 'vehilceOwnerPanel') {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'vehicleOwnerDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else if (this.reviewData === 'nomineDetailsPanel') {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'nomineeDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'vehicleDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         }
    //       } else if (
    //         (proposal.vehicle_details !== null && this.vehicleType !== 'new') ||
    //         (this.quoteData?.is_breakin && this.productTypeValue === 'satp')
    //       ) {
    //         if (this.reviewData === 'vehicleDetailPanel') {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'vehicleDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else if (this.reviewData === 'vehilceOwnerPanel') {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'vehicleOwnerDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else if (this.reviewData === 'nomineDetailsPanel') {
    //           this.showPreviousPolicyDetails = true;
    //           this.accordianExpanded = 'nomineeDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         } else {
    //           this.accordianExpanded = 'previousPolicyDetails';
    //           this.openDesiredStep(this.accordianExpanded);
    //         }
    //       }
    //     }
    //   });
    // }
    // sessionStorage.removeItem('alreadyCalled');
  }

  loadCkyc(expansionName: string) {
    if (expansionName === 'ckyc') {
      this.isCkycLoaded = true;
    } else if (expansionName === 'Vehicle Owner Details') {
      this.showVehicleOwnerDetails = true;
      this.isLoadVehicleOwnerDetails = true;
    } else if (expansionName === 'Nominee Details') {
      this.showNomineeDetails = true;
      this.isLoadNomineeDetails = true;
    } else if (expansionName === 'Vehicle Details') {
      this.showVehicleDetails = true;
      this.isLoadVehicleDetails = true;
    } else if (expansionName === 'Previous Policy Details') {
      this.showPreviousPolicyDetails = true;
      this.isLoadPreviousPolicyDetails = true;
    }
  }
  getVahaanDetails(reg_no: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.registration_number()}?regn_no=${reg_no}`
      )
      .subscribe((res: any) => {
        if (res) {
          this.sharedData.vahaanDetails(res);
        }
      });
  }

  // step(stepper: any) {
  //   if (stepper == 'ckyc') {
  //     this.step1 = true;
  //     this.step2 = false;
  //     this.step3 = false;
  //     this.step4 = false;
  //     this.step5 = false;
  //   } else if (stepper === 'Vehicle Owner Details') {
  //     this.step1 = false;
  //     this.step2 = true;
  //     this.step3 = false;
  //     this.step4 = false;
  //     this.step5 = false;
  //   } else if (stepper === 'Nominee Details') {
  //     this.step1 = false;
  //     this.step2 = false;
  //     this.step3 = true;
  //     this.step4 = false;
  //     this.step5 = false;
  //   } else if (stepper === 'Vehicle Details') {
  //     this.step1 = false;
  //     this.step2 = false;
  //     this.step3 = false;
  //     this.step4 = true;
  //     this.step5 = false;
  //   } else if (stepper === 'Previous Policy Details') {
  //     this.step1 = false;
  //     this.step2 = false;
  //     this.step3 = false;
  //     this.step4 = false;
  //     this.step5 = true;
  //   }
  // }
  /**
   * Method to handle step change in the stepper component
   * @param event
   */
  onStepChange(event: any) {
    /**
     * Get the index of the selected step and add 1 to convert to step number
     */
    const selectedStep = event.selectedIndex + 1;

    /**
     * Initialize variables for total steps and step number prefix
     */
    let totalSteps = 3;
    let stepNumberPrefix = 'Step';

    /**
     * Determine the total number of steps based on conditions
     */
    if (this.isNotShowInNewPolicyDetails && this.isNotShowNomineeDetails) {
      totalSteps = 5;
    } else if (
      this.isNotShowInNewPolicyDetails ||
      this.isNotShowNomineeDetails
    ) {
      totalSteps = 4;
    }

    /**
     * Set the step number string based on the selected step and total steps
     */
    this.stepNumber = `${stepNumberPrefix} ${selectedStep}/${totalSteps}`;

    /**
     * Switch statement to set step header and image based on selected step and conditions
     */
    switch (selectedStep) {
      case 1:
        this.stepHeader = 'CKYC Details';
        this.stepImage = '/assets/icon/step-1.svg';
        break;
      case 2:
        this.stepHeader = 'Vehicle Owner Details';
        this.stepImage = '/assets/icon/step-2.svg';
        break;
      case 3:
        if (this.isNotShowNomineeDetails) {
          this.stepHeader = 'Nominee Details';
          this.stepImage = '/assets/icon/step-3.svg';
        } else {
          this.stepHeader = 'Vehicle Details';
          this.stepImage = '/assets/icon/step-4.svg';
        }
        break;
      case 4:
        if (this.isNotShowInNewPolicyDetails) {
          this.stepHeader = 'Previous Policy Details';
          this.stepImage = '/assets/icon/step-5.svg';
        } else {
          this.stepHeader = 'Vehicle Details';
          this.stepImage = '/assets/icon/step-4.svg';
        }
        break;
      case 5:
        this.stepHeader = 'Previous Policy Details';
        this.stepImage = '/assets/icon/step-5.svg';
        break;
      default:
        break;
    }
  }

  /**
   * get ckyc data
   */
  getProceedData(data: any) {
    this.proceedData = data;
    if (data) {
      this.stepper?.next();
    }
  }
  vehicleOwnerDetailsData(data: any) {
    if (data) {
      this.stepper.next();
    }
  }
  /**
   * get nominee Details Data
   */
  nomineeDetailsData(data: any) {
    if (data) {
      this.stepper.next();
    }
  }
  /**
   * get Vehicle Details Data
   */
  proposerVehicleDetailsData(data: any) {
    if (data) {
      if (this.isNotShowInNewPolicyDetails) {
        this.showPreviousPolicyDetails = true;
      }
      this.stepper.next();
    }
  }
  /**
   * get vehicle owner details data
   */
  getVehicleOwnerData(data: any) {
    if (data) {
      if (this.isNotShowNomineeDetails) {
        this.showNomineeDetails = true;
      }
      this.stepper?.next();
    }
  }
  getNomineeData(data: any) {
    if (data) {
      this.stepper?.next();
      this.showVehicleDetails = true;
    }
  }
  getVehicleData(data: any) {
    if (data) {
      // this.showPreviousPolicyDetails = true;
      this.stepper?.next();
    }
  }
  back() {
    this.partnerCodeTraceId = sessionStorage.getItem('partnerCodeTraceId');
    this.router.navigate([
      'quotes/',
      JSON.parse(this.partnerCodeTraceId)?.trace_id,
    ]);
  }
  getProposalDataForPatch() {
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      if (!sessionStorage.getItem('kycData')) {
        const kycData: any = {
          verification_status: proposal?.ckyc_details?.is_verification,
          proposer_type: proposal?.customer_details?.customer_type,
          insurer_code: proposal?.insurer_code,
        };
        if (kycData) {
          sessionStorage.setItem('kycData', JSON.stringify(kycData));
        }
      }
      if (
        proposal?.ckyc_details !== null &&
        this.quoteData['insurer_code'] === 'digit'
      ) {
        this.showVehicleOwnerDetails = true;
        this.stepper?.next();
        this.accordianExpanded = 'vehicleOwnerDetails';
        this.openDesiredStep(this.accordianExpanded);
      } else if (
        proposal?.ckyc_details !== null &&
        this.quoteData['insurer_code'] !== 'digit'
      ) {
        if (this.quoteData?.insurer_code == 'united_india') {
          if (proposal?.ckyc_details?.is_verification) {
            this.accordianExpanded = 'vehicleOwnerDetails';
            this.openDesiredStep(this.accordianExpanded);
            this.showVehicleOwnerDetails = true;
          }
        }
        const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
        if (
          Object.keys(kycData).length > 0 &&
          this.isNonEmptyDetails(proposal?.ckyc_details)
        ) {
          this.showVehicleOwnerDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        }
      }
      if (proposal.customer_details !== null && !this.isNotShowNomineeDetails) {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          if (
            this.kycPending?.redirection_url_via_form ||
            proposal?.ckyc_details?.is_verification
          ) {
            this.sharedData.vehicleOwnerForm.subscribe((res) => {
              if (res) {
                this.showVehicleDetails = true;
                this.accordianExpanded = 'vehicleDetails';
                this.openDesiredStep(this.accordianExpanded);
              }
            });
          } else {
            this.showVehicleDetails = true;
            this.accordianExpanded = 'vehicleDetails';
            this.openDesiredStep(this.accordianExpanded);
          }
        }
      } else if (
        proposal.customer_details !== null &&
        this.isNotShowNomineeDetails
      ) {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showNomineeDetails = true;
          this.showVehicleOwnerDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          if (
            this.kycPending?.redirection_url_via_form ||
            proposal?.ckyc_details?.is_verification
          ) {
            this.sharedData.vehicleOwnerForm.subscribe((res) => {
              if (res) {
                this.showNomineeDetails = true;
                this.showVehicleOwnerDetails = true;
                this.accordianExpanded = 'nomineeDetails';
                this.openDesiredStep(this.accordianExpanded);
              }
            });
          } else {
            this.showNomineeDetails = true;
            this.showVehicleOwnerDetails = true;
            this.accordianExpanded = 'nomineeDetails';
            this.openDesiredStep(this.accordianExpanded);
          }
        }
      }
      if (proposal.nominee_details !== null) {
        if (this.reviewData === 'nomineDetailsPanel') {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'nomineeDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleDetails';
          this.openDesiredStep(this.accordianExpanded);
        }
      }
      if (proposal.vehicle_details !== null && this.vehicleType === 'new') {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else if (this.reviewData === 'nomineDetailsPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'nomineeDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleDetails';
          this.openDesiredStep(this.accordianExpanded);
        }
      } else if (
        (proposal.vehicle_details !== null && this.vehicleType !== 'new') ||
        (this.quoteData?.is_breakin && this.productTypeValue === 'satp')
      ) {
        if (this.reviewData === 'vehicleDetailPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else if (this.reviewData === 'vehilceOwnerPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else if (this.reviewData === 'nomineDetailsPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'nomineeDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          this.accordianExpanded = 'previousPolicyDetails';
          this.openDesiredStep(this.accordianExpanded);
        }
      }
    });
    this.sharedData.fetchKycData.subscribe((data) => {
      if (data) {
        this.showVehicleOwnerDetails = true;
        this.accordianExpanded = 'vehicleOwnerDetails';
        this.openDesiredStep(this.accordianExpanded);
      }
    });

    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    if (this.mmvData?.policy_expiry === 'IDK') {
      this.isNotShowInNewPolicyDetails = false;
    }
    this.sharedData.isDisabledVehicleButton(this.isNotShowInNewPolicyDetails);
    this.sharedData?.nomineeData.subscribe((nominee) => {
      if (nominee) {
        this.accordianExpanded = 'nomineeDetails';
        this.openDesiredStep(this.accordianExpanded);
      }
    });
  }
  /**
   * OpenDesiredStep is a Function which Handel the stepper auto opening,
   * @param data (whatever the form field , indicate there value like - ckyc,vehicleOwnerDetails etc)
   */
  openDesiredStep(data: any): void {
    if (this.isMobileView) {
      if (this.isNotShowNomineeDetails && this.isNotShowInNewPolicyDetails) {
        if (data === 'nomineeDetails') {
          setTimeout(() => {
            this.currentStepIndex = 2;
          }, 1000);
        } else if (data === 'vehicleDetails') {
          setTimeout(() => {
            this.currentStepIndex = 3;
          }, 1000);
        } else if (data === 'ckyc') {
          setTimeout(() => {
            this.currentStepIndex = 0;
          }, 1000);
        } else if (data === 'vehicleOwnerDetails') {
          setTimeout(() => {
            this.currentStepIndex = 1;
          }, 1000);
        } else if (data === 'previousPolicyDetails') {
          setTimeout(() => {
            this.currentStepIndex = 4;
            this.showPreviousPolicyDetails = true;
          }, 1000);
        }
      } else if (
        this.isNotShowNomineeDetails &&
        !this.isNotShowInNewPolicyDetails
      ) {
        if (data === 'ckyc') {
          setTimeout(() => {
            this.currentStepIndex = 0;
          }, 1000);
        } else if (data === 'vehicleOwnerDetails') {
          setTimeout(() => {
            this.currentStepIndex = 1;
          }, 1000);
        } else if (data === 'nomineeDetails') {
          setTimeout(() => {
            this.currentStepIndex = 2;
          }, 1000);
        } else if (data === 'vehicleDetails') {
          setTimeout(() => {
            this.currentStepIndex = 3;
          }, 1000);
        }
      } else if (
        this.isNotShowInNewPolicyDetails &&
        !this.isNotShowNomineeDetails
      ) {
        if (data === 'ckyc') {
          setTimeout(() => {
            this.currentStepIndex = 0;
          }, 1000);
        } else if (data === 'vehicleOwnerDetails') {
          setTimeout(() => {
            this.currentStepIndex = 1;
          }, 1000);
        } else if (data === 'vehicleDetails') {
          setTimeout(() => {
            this.currentStepIndex = 2;
          }, 1000);
        } else if (data === 'previousPolicyDetails') {
          setTimeout(() => {
            this.currentStepIndex = 3;
            this.showPreviousPolicyDetails = true;
          }, 1000);
        }
      } else {
        if (data === 'vehicleDetails') {
          setTimeout(() => {
            this.currentStepIndex = 2;
          }, 1000);
        } else if (data === 'ckyc') {
          setTimeout(() => {
            this.currentStepIndex = 0;
          }, 1000);
        } else if (data === 'vehicleOwnerDetails') {
          setTimeout(() => {
            this.currentStepIndex = 1;
          }, 1000);
        }
      }
    }
  }
  // /**
  //  * get united Ckyc Token api
  //  */

  // getUnitedCkycToken() {
  //   this.apiService
  //     .getRequestedResponse(
  //       `${ApiConstants.united_ckyc_token}?insurer_quote_id=${this.quoteData?.quote_id}&transaction_id=${this.quoteData?.transaction_id}`
  //     )
  //     .subscribe((res) => {
  //       this.unitedTokenValue = res;
  //       const base64String = `${res?.workflow_id}`;
  //       this.decodedString = atob(base64String);
  //       setTimeout(() => {
  //         this.unitedCkycVerification(res?.token, this.decodedString);
  //       }, 1000);
  //     });
  // }

  // unitedCkycVerification(token: any, workflod_id: any) {
  //   const accessToken = `${token}`;
  //   const hyperKycConfig = new (window as any).HyperKycConfig(
  //     accessToken,
  //     `${workflod_id}`,
  //     `${this.proposalId}`
  //   );
  //   // (window as any).HyperKYCModule.launch(hyperKycConfig, this.handler);
  //   this.launchHyperKYC(hyperKycConfig);
  // }

  // launchHyperKYC(config: any) {
  //   HyperKYCModule.launch(config, this.handler);
  // }

  // handler = (HyperKycResult: any) => {
  //   switch (HyperKycResult.status) {
  //     case 'user_cancelled':
  //       this.sharedData.openSnackBar(
  //         HyperKycResult['errorMessage'],
  //         false,
  //         3000
  //       );
  //       this.unitedCkycResponse(HyperKycResult);
  //       this.getUnitedCkycToken();
  //       break;
  //     case 'error':
  //       this.sharedData.openSnackBar(
  //         HyperKycResult['errorMessage'],
  //         false,
  //         3000
  //       );
  //       this.unitedCkycResponse(HyperKycResult);
  //       this.getUnitedCkycToken();
  //       break;
  //     case 'auto_approved':
  //       this.unitedCkycResponse(HyperKycResult);
  //       break;
  //     case 'auto_declined':
  //       this.unitedCkycResponse(HyperKycResult);
  //       this.getUnitedCkycToken();
  //       break;
  //     case 'needs_review':
  //       this.unitedCkycResponse(HyperKycResult);
  //       this.getUnitedCkycToken();
  //       break;
  //   }
  // };

  // /**
  //  * United CKYC Response Update
  //  */

  // unitedCkycResponse(ckycResponse: any) {
  //   const data = {
  //     transaction_id: this.quoteData?.transaction_id,
  //     proposal_id: this.proposalId,
  //     ckyc_response: { ckycResponse },
  //   };
  //   this.apiService
  //     .postRequestedResponse(ApiConstants.united_ckyc_response, data)
  //     .subscribe((res) => {
  //       if (res?.status == true) {
  //         this.sharedData.openSnackBar(res?.message, true, 3000);
  //         this.sharedData.createProposalId();
  //       } else {
  //         this.sharedData.openSnackBar(res?.message, false, 3000);
  //         this.getUnitedCkycToken();
  //       }
  //     });
  // }
  getInsurerQuoteId(transaction_Id: any) {
    this.transactionId = transaction_Id;
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_quote_id}/${transaction_Id}`
      )
      .subscribe((response) => {
        if (response) {
          if (response) {
            sessionStorage.setItem('proposal_Id', response?.proposal_id);
            this.renewalDetails = sessionStorage.getItem('renewalDetails');
            const parsedRenewalDetails = JSON.parse(this.renewalDetails);
            if (!parsedRenewalDetails) {
              sessionStorage.setItem('vehiclePopup', 'true');
            }
            this.getInsurerCode(this.transactionId, response?.insurer_quote_id);
          }
        }
      });
  }
  getInsurerCode(transaction_id: any, insurer_quote_id: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_insurer_code}/${transaction_id}/${insurer_quote_id}`
      )
      .subscribe((response) => {
        if (response) {
          this.getInsurerData = response;
          sessionStorage.setItem(
            'vehicleType',
            response.quote_request.vehicle_type
          );
          sessionStorage.setItem(
            'withoutVehicleNumber',
            response.quote_request?.meta_data?.mmv_form_data
              ?.withoutVehicleNumber
          );
          if (this.getInsurerData?.quote_request?.trace_id) {
            let traceId = {
              trace_id: this.getInsurerData?.quote_request?.trace_id,
              partner_code: this.getInsurerData?.quote_request?.partner_code,
            };
            sessionStorage.setItem(
              'partnerCodeTraceId',
              JSON.stringify(traceId)
            );
            this.sharedData.partnerCode(
              this.getInsurerData?.quote_request?.partner_code
            );
          }

          this.getNcbList(response.quote_request);
          this.getRTOData('rto_code', response?.quote_request.rb_rto_code);
          this.sharedData.getInsurerDetail(response);
          const transactionId = response?.quote_response?.transaction_id;
          if (transactionId) {
            sessionStorage.setItem('transaction_id', transactionId);
          }

          const quoteResponseToStore = response?.quote_response;
          if (quoteResponseToStore) {
            sessionStorage.setItem(
              'quotes_data',
              JSON.stringify(quoteResponseToStore)
            );
          }
          this.quoteData = JSON.parse(
            sessionStorage.getItem('quotes_data') || '{}'
          );
          this.sharedData?.getAddressValidation(this.quoteData?.insurer_code);
          const newVehicleType = response?.quote_request?.business_type;
          if (newVehicleType) {
            sessionStorage.setItem('newVehicleType', newVehicleType);
          }

          const proposerType = response?.quote_request?.customer_type;
          if (proposerType) {
            sessionStorage.setItem('proposerType', proposerType);
          }

          const productType = response?.quote_request?.product_type;
          if (productType) {
            sessionStorage.setItem('productType', productType);
          }
          let renewalTypeData = response?.quote_request?.is_rb_renewal;
          if (renewalTypeData) {
            sessionStorage.setItem('renewalType', 'renewal');
            this.isPrevoiusInsurer = true;
            sessionStorage.setItem('isprevoiusInsurer', this.isPrevoiusInsurer);
            let registartionNumber = response?.quote_request?.registration_no;
            let policy_number=response?.quote_request?.policy_number
            let apiUrl;
            if(registartionNumber!=null && registartionNumber!='' && registartionNumber!=undefined){
              apiUrl = `?registration_number=${registartionNumber.toUpperCase()}`;
            }else{
              apiUrl = `?previous_policy_number=${policy_number}`;
            }
            this.apiService
              .getRequestedResponse(
                `${ApiConstants.get_renewal_policy}${apiUrl}`
              )
              .subscribe((res: any) => {
                if (res?.status) {
                  sessionStorage.setItem(
                    'RenewalPreviousDetails',
                    JSON.stringify(res)
                  );
                  this.sharedData.getRenewalData(res);
                  this.sharedData?.getAddressValidation(
                    this.quoteData?.insurer_code
                  );

                  this.sharedData.createProposalId();
                }
              });
          }
          if (
            sessionStorage.getItem('withoutVehicleNumber') == 'true' &&
            response?.quote_request?.registration_no != null &&
            !response?.quote_request?.is_rb_renewal
          ) {
            this.getVahaanDetails(response?.quote_request?.registration_no);
          }
          const regNo = response?.quote_request?.registration_no;
          if (regNo) {
            sessionStorage.setItem('registrationNumber', regNo);
          }
          this.apiService
            .getRequestedResponse(ApiConstants.get_previous_insurer())
            .subscribe((response: any) => {
              for (let insurer of response) {
                if (
                  insurer?.rb_insurer_code ===
                  quoteResponseToStore?.insurer_code
                ) {
                  this.previous_insurer = insurer;
                }
              }
            });

          this.apiService
            .getRequestedResponse(
              `${ApiConstants.getCoverageType()}?reg_year=${
                response?.quote_request?.registration_year
              }&vehicle_type=${
                response?.quote_request?.vehicle_type
              }&previous_policy_type=${
                response?.quote_request?.product_type
                  ? response?.quote_request?.product_type
                  : ''
              }&previous_policy_expiry_date=${
                response?.quote_request?.previous_policy_exp_date
                  ? response?.quote_request?.previous_policy_exp_date
                  : ''
              }`
            )
            .subscribe((res: any) => {
              if (res) {
                for (let coverage of res) {
                  if (
                    coverage?.code === response?.quote_request?.product_type
                  ) {
                    sessionStorage.setItem(
                      'planType',
                      JSON.stringify(coverage)
                    );
                  }
                }
              }
            });
          if (!renewalTypeData) {
            this.sharedData?.getAddressValidation(this.quoteData?.insurer_code);

            this.sharedData.createProposalId();
          }
        }
      });
  }

  getRTOData(type?: any, rb_rto_code?: any) {
    let apiData;

    apiData = type == 'rto_code' ? `?search_element=${rb_rto_code}` : '';

    this.apiService
      .getRequestedResponse(`${ApiConstants.get_rto_list()}${apiData}`)
      .subscribe((res) => {
        if (res) {
          this.rtoCity = res;
          this.getVehicleMMVPopup(
            '',
            this.getInsurerData?.quote_request?.rb_mmv_id,
            this.getInsurerData?.quote_request?.vehicle_type,
            this.getInsurerData?.quote_request
          );
        }
      });
  }
  getVehicleMMVPopup(name: any, id: any, type?: any, allRequestData?: any) {
    let apiData;
    if (id) {
      apiData = `?product_name=${type}&rb_mmv_id=${id}`;
    }
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
      .subscribe((res: any) => {
        this.loaderService.hide();
        if (res) {
          this.vehicleMMVData = res;
          this.vehicleMMVData[0].displayMM = `${this.vehicleMMVData[0].rb_make_name} | ${this.vehicleMMVData[0].rb_model_name}`;
          sessionStorage.setItem(
            'productType',
            this.getInsurerData?.quote_request?.product_type
          );
          let reformattedPolicyDate;
          if (this.getInsurerData?.quote_request?.previous_policy_exp_date) {
            let inputDate =
              this.getInsurerData?.quote_request?.previous_policy_exp_date;
            let [day, month, year] = inputDate.split('/');
            let reformattedDate = `${month}/${day}/${year}`;
            // console.log();
            reformattedPolicyDate = new Date(reformattedDate);
          } else {
            reformattedPolicyDate = null;
          }

          let mmvData = {
            rb_mmv_id: this.getInsurerData?.quote_request?.rb_mmv_id,
            policy_expiry: this.getInsurerData?.quote_request?.product_type,
            policy_expiry_date: reformattedPolicyDate,
            previous_insurer:
              this.getInsurerData?.quote_request?.meta_data?.mmv_form_data
                ?.previous_insurer,
            manufacture_date:
              this.getInsurerData?.quote_request?.manufacture_date,
            registration_date:
              this.getInsurerData?.quote_request?.registration_date,
            registration_city: this.rtoCity[0],
            vehicle_model: this.vehicleMMVData[0],
            vehicle_make: this.vehicleMMVData[0],
            vehicle_variant: this.vehicleMMVData[0],
            allQuotesRequest: allRequestData,
            vehicle_fuel: this.vehicleMMVData[0].fuel,
            addNcbBoth: '',
            user_car: this.getInsurerData?.quote_request.is_ownership_transfer,
            previous_claimed: this.getInsurerData?.quote_request.is_claimed,
            policy_expiry_id_data:
              this.getInsurerData?.quote_request.previous_policy_type,
            typeofPreviousPolicy:
              this.getInsurerData?.quote_request?.meta_data?.policy_expiry_type,
            hidePreviousClaimed:
              this.getInsurerData?.quote_request?.meta_data
                ?.hidePreviousClaimed,
            ncb_discount: '',
          };
          if (
            this.getInsurerData?.quote_request?.meta_data?.selectedAddons !==
            'undefined'
          ) {
            let addonsValue = JSON.parse(
              this.getInsurerData?.quote_request?.meta_data?.selectedAddons
            );

            sessionStorage.setItem(
              'selectedAddons',
              JSON.stringify(addonsValue)
            );
          } else {
            sessionStorage.setItem('selectedAddons', JSON.stringify(undefined));
          }
          if (this.getInsurerData?.quote_request?.meta_data?.mmv_form_data) {
            let mmvFormData =
              this.getInsurerData?.quote_request?.meta_data?.mmv_form_data;
            // let mmvValue = JSON.parse(mmvFormData);
            sessionStorage.setItem(
              'lastSelectedTabIndex',
              this.getInsurerData?.quote_request?.meta_data?.selectedTabIndex
            );
            sessionStorage.setItem('mmv_data', JSON.stringify(mmvFormData));
          }
          // if (mmvData) {
          //   sessionStorage.setItem('mmv_data', JSON.stringify(mmvData));
          // }
          let pageLoadData = sessionStorage.getItem('pageLoad');
          if (!pageLoadData) {
            sessionStorage.setItem('pageLoad', 'true');
            window.location.reload();
          }
          this.sharedData.sendRenewalMmv(mmvData);
        }
      });
  }

  getNcbList(allRequestData: any) {
    this.apiService
      .getRequestedResponse(ApiConstants.ncb_list())
      .subscribe((res) => {
        this.expiryListData = res;
        for (let i = 0; i <= this.expiryListData.length - 1; i++) {
          if (
            this.expiryListData[i].old_ncb_value ==
            allRequestData.previous_year_ncb
          ) {
            this.allNCBData = this.expiryListData[i];
          }
        }
        sessionStorage.setItem(
          'allNCBDataProposal',
          JSON.stringify(this.allNCBData)
        );
      });
  }
  disableKeyboardInteraction(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.code === 'Enter' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }
  }
  isNonEmptyDetails(details: any) {
    const { is_verification, ...restDetails } = details;
    return Object.values(restDetails).some((value) => value !== null);
  }
}
