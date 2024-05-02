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

  constructor(
    public matDialog: WindowRef,
    private sharedData: SharedDataService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.sharedData.createProposalId();
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
    } else if (this.quoteData?.is_breakin && this.productTypeValue === 'satp') {
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
}
