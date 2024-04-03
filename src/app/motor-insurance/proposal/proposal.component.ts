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

  constructor(
    public matDialog: WindowRef,
    private sharedData: SharedDataService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.sharedData.createProposalId();
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    this.productTypeValue = sessionStorage.getItem('productType');
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
          (isCpa?.add_on_code === 'CPA' || isCpa?.add_on_code === 'CPA3') &&
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
  }

  loadCkyc(expansionName: string) {
    if (expansionName === 'ckyc') {
      this.isCkycLoaded = true;
    } else if (expansionName === 'Vehicle Owner Details') {
      this.showVehicleOwnerDetails = true;
    } else if (expansionName === 'Nominee Details') {
      this.showNomineeDetails = true;
    } else if (expansionName === 'Vehicle Details') {
      this.showVehicleDetails = true;
    } else if (expansionName === 'Previous Policy Details') {
      this.showPreviousPolicyDetails = true;
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
  onStepChange(event: any) {
    const selectedStep = event.selectedIndex + 1;
    if (selectedStep == 1) {
      this.stepNumber = 'Step 1/5';
      this.stepHeader = 'CKYC Details';
      this.stepImage = '/assets/icon/step-1.svg';
    } else if (selectedStep == 2) {
      this.stepNumber = 'Step 2/5';
      this.stepHeader = 'Vehicle Owner Details';
      this.stepImage = '/assets/icon/step-2.svg';
    } else if (selectedStep == 3) {
      this.stepNumber = 'Step 3/5';
      this.stepHeader = 'Nominee Details';
      this.stepImage = '/assets/icon/step-3.svg';
    } else if (selectedStep == 4) {
      this.stepNumber = 'Step 4/5';
      this.stepHeader = 'Vehicle Details';
      this.stepImage = '/assets/icon/step-4.svg';
    } else if (selectedStep == 5) {
      this.stepNumber = 'Step 5/5';
      this.stepHeader = 'Previous Policy Details';
      this.stepImage = '/assets/icon/step-5.svg';
    }
  }
  /**
   * get ckyc data
   */
  getProceedData(data: any) {
    this.proceedData = data;
    if (data) {
      this.stepper.next();
    }
  }
  vehicleOwnerDetailsData(data: any) {
    if (data) {
      this.stepper.next();
    }
  }
  nomineeDetailsData(data: any) {
    if (data) {
      this.stepper.next();
    }
  }
  proposerVehicleDetailsData(data: any) {
    if (data) {
      this.stepper.next();
    }
  }
  getVehicleOwnerData(data: any) {
    if (data) {
      // this.showNomineeDetails = true;
      this.stepper.next();
    }
  }
  getNomineeData(data: any) {
    if (data) {
      // this.showVehicleDetails = true;
    }
  }
  getVehicleData(data: any) {
    if (data) {
      // this.showPreviousPolicyDetails = true;
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
      } else if (
        proposal?.ckyc_details !== null &&
        this.quoteData['insurer_code'] !== 'digit'
      ) {
        this.showVehicleOwnerDetails = true;
      }
      if (proposal.customer_details !== null && !this.isNotShowNomineeDetails) {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
        } else {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleDetails';
        }
      } else if (
        proposal.customer_details !== null &&
        this.isNotShowNomineeDetails
      ) {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showNomineeDetails = true;
          this.showVehicleOwnerDetails = true;

          this.accordianExpanded = 'vehicleOwnerDetails';
        } else {
          this.showNomineeDetails = true;
          this.showVehicleOwnerDetails = true;

          this.accordianExpanded = 'nomineeDetails';
        }
      }
      if (proposal.nominee_details !== null) {
        if (this.reviewData === 'nomineDetailsPanel') {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'nomineeDetails';
        } else {
          this.showVehicleDetails = true;
          this.accordianExpanded = 'vehicleDetails';
        }
      }
      if (proposal.vehicle_details !== null && this.vehicleType === 'new') {
        if (this.reviewData === 'vehilceOwnerPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
        } else if (this.reviewData === 'nomineDetailsPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'nomineeDetails';
        } else {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleDetails';
        }
      } else if (
        (proposal.vehicle_details !== null && this.vehicleType !== 'new') ||
        (this.quoteData?.is_breakin && this.productTypeValue === 'satp')
      ) {
        if (this.reviewData === 'vehicleDetailPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleDetails';
        } else if (this.reviewData === 'vehilceOwnerPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'vehicleOwnerDetails';
        } else if (this.reviewData === 'nomineDetailsPanel') {
          this.showPreviousPolicyDetails = true;
          this.accordianExpanded = 'nomineeDetails';
        } else {
          this.accordianExpanded = 'previousPolicyDetails';
        }
      }
    });
    this.sharedData.fetchKycData.subscribe((data) => {
      if (data) {
        this.showVehicleOwnerDetails = true;
        this.accordianExpanded = 'vehicleOwnerDetails';
      }
    });
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    if (this.mmvData?.policy_expiry === 'IDK') {
      this.isNotShowInNewPolicyDetails = false;
    }
  }
}
