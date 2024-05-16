import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatStepper } from '@angular/material/stepper';

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
  isNotShowCkycDetails: boolean = true;
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

  constructor(
    public matDialog: WindowRef,
    private sharedData: SharedDataService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.renewalDetails = sessionStorage.getItem('renewalDetails');
    const parsedRenewalDetails = JSON.parse(this.renewalDetails);
    if (parsedRenewalDetails) {
      sessionStorage.setItem(
        'proposal_Id',
        parsedRenewalDetails?.transactional_details?.proposal_id
      );
      this.getInsurerCode(
        parsedRenewalDetails?.transactional_details?.transaction_id,
        parsedRenewalDetails?.transactional_details?.quote_id
      );
    } else {
      this.sharedData.createProposalId();
    }

    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    this.kycPending = kycData;
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    this.insuranceVehicleType = localStorage.getItem('vehicleType');
    this.productTypeValue = sessionStorage.getItem('productType');
    this.vehicleCardData = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );
    this.reviewData = this.sharedData.getProposalReviewDetails;
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
        this.insuranceVehicleType == 'private_car'
          ? ''
          : 'Attention!! Some insurance company will ask for an inspection as previous policy is expired';
      this.breakIn = true;
    } else if (
      this.quoteData['status'] &&
      this.quoteData['is_breakin'] &&
      this.vehicleCardData?.policy_expiry_date == 'Not Sure'
    ) {
      this.vehicleInspectionMessage =
        this.insuranceVehicleType == 'private_car'
          ? ''
          : 'Attention!! Some insurance company will ask for an inspection as previous policy date is not available.';
      this.breakIn = true;
    }
    if (this.quoteData?.insurer_code == 'united_india') {
      this.sharedData.getProposalDetails.subscribe((proposal) => {
        if (proposal) {
          this.proposalId = proposal?.proposal_id;
          if (proposal?.ckyc_details == null) {
            this.getUnitedCkycToken();
          }
          this.isNotShowCkycDetails = false;
          this.showVehicleOwnerDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
          if (
            proposal.customer_details !== null &&
            !this.isNotShowNomineeDetails
          ) {
            if (this.reviewData === 'vehilceOwnerPanel') {
              this.showVehicleDetails = true;
              this.accordianExpanded = 'vehicleOwnerDetails';
              this.openDesiredStep(this.accordianExpanded);
            } else {
              if (this.kycPending?.redirection_url_via_form) {
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
              if (this.kycPending?.redirection_url_via_form) {
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
        }
      });
    }
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
    this.router.navigate(['/motor/quotes']);
  }
  getProposalDataForPatch() {
    this.sharedData.getProposalDetails.subscribe((proposal) => {
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
        const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
        if (Object.keys(kycData).length > 0) {
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
          this.showVehicleOwnerDetails = true;
        }
      }
      if (proposal.customer_details !== null && !this.isNotShowNomineeDetails) {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
          this.openDesiredStep(this.accordianExpanded);
        } else {
          if (this.kycPending?.redirection_url_via_form) {
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
          if (this.kycPending?.redirection_url_via_form) {
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
  /**
   * get united Ckyc Token api
   */

  getUnitedCkycToken() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.united_ckyc_token}?insurer_quote_id=${this.quoteData?.quote_id}&transaction_id=${this.quoteData?.transaction_id}`
      )
      .subscribe((res) => {
        this.unitedTokenValue = res;
        const base64String = `${res?.workflow_id}`;
        this.decodedString = atob(base64String);
        setTimeout(() => {
          this.unitedCkycVerification(res?.token, this.decodedString);
        }, 2000);
      });
  }

  unitedCkycVerification(token: any, workflod_id: any) {
    const accessToken = `${token}`;
    const hyperKycConfig = new (window as any).HyperKycConfig(
      accessToken,
      `${workflod_id}`,
      `${this.proposalId}`
    );
    // (window as any).HyperKYCModule.launch(hyperKycConfig, this.handler);
    this.launchHyperKYC(hyperKycConfig);
  }

  launchHyperKYC(config: any) {
    HyperKYCModule.launch(config, this.handler);
  }

  handler = (HyperKycResult: any) => {
    switch (HyperKycResult.status) {
      case 'user_cancelled':
        this.sharedData.openSnackBar(
          HyperKycResult['errorMessage'],
          false,
          3000
        );
        this.unitedCkycResponse(HyperKycResult['errorMessage']);
        break;
      case 'error':
        this.sharedData.openSnackBar(
          HyperKycResult['errorMessage'],
          false,
          3000
        );
        this.unitedCkycResponse(HyperKycResult['errorMessage']);
        break;
      case 'auto_approved':
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'auto_declined':
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'needs_review':
        this.unitedCkycResponse(HyperKycResult);
        break;
    }
  };

  /**
   * United CKYC Response Update
   */

  unitedCkycResponse(ckycResponse: any) {
    const data = {
      transaction_id: this.quoteData?.transaction_id,
      proposal_id: this.proposalId,
      ckyc_response: { ckycResponse },
    };
    this.apiService
      .postRequestedResponse(ApiConstants.united_ckyc_response, data)
      .subscribe((res) => {
        if (res?.status) {
          this.sharedData.openSnackBar(res?.message, true, 3000);
          this.sharedData.createProposalId();
        } else {
          this.sharedData.openSnackBar(res?.message, false, 3000);
          this.getUnitedCkycToken();
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
          this.getRTOData('rto_code', response?.quote_request.rb_rto_code);
          this.getVehicleMMVPopup(
            '',
            response?.quote_request?.rb_mmv_id,
            response?.quote_request?.vehicle_type,
            response?.quote_request
          );
          this.sharedData.getInsurerDetail(response);
          const transactionId = response?.quote_response?.transaction_id;
          if (transactionId) {
            sessionStorage.setItem('transaction_id', transactionId);
          }

          let pageLoadData = sessionStorage.getItem('pageLoad');
          if (!pageLoadData) {
            sessionStorage.setItem('pageLoad', 'true');
            window.location.reload();
          }

          const quoteResponseToStore = response?.quote_response;
          if (quoteResponseToStore) {
            sessionStorage.setItem(
              'quotes_data',
              JSON.stringify(quoteResponseToStore)
            );
          }
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
          this.apiService
            .getRequestedResponse(ApiConstants.get_previous_insurer)
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
              `${ApiConstants.getCoverageType}?reg_year=${response?.quote_request?.registration_year}&vehicle_type=${response?.quote_request?.vehicle_type}`
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
          this.sharedData.createProposalId();
        }
      });
  }
  getRTOData(type?: any, rb_rto_code?: any) {
    let apiData;

    apiData = type == 'rto_code' ? `?search_element=${rb_rto_code}` : '';

    this.apiService
      .getRequestedResponse(`${ApiConstants.get_rto_list}${apiData}`)
      .subscribe((res) => {
        if (res) {
          this.rtoCity = res;
        }
      });
  }
  getVehicleMMVPopup(name: any, id: any, type?: any, allRequestData?: any) {
    let apiData;
    if (id) {
      apiData = `?product_name=${type}&rb_mmv_id=${id}`;
    }
    this.apiService
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res: any) => {
        if (res && this.rtoCity) {
          this.vehicleMMVData = res;
          this.vehicleMMVData[0].displayMM = `${this.vehicleMMVData[0].rb_make_name} | ${this.vehicleMMVData[0].rb_model_name}`;

          let mmvData = {
            rb_mmv_id: this.getInsurerData?.quote_request?.rb_mmv_id,
            policy_expiry: this.getInsurerData?.quote_request?.product_type,
            policy_expiry_date:
              this.getInsurerData?.quote_request?.previous_policy_exp_date,
            previous_insurer: this.previous_insurer,
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
          };
          if (mmvData) {
            sessionStorage.setItem('mmv_data', JSON.stringify(mmvData));
          }
        }
      });
  }
}
