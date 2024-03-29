import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
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
  proposalDetails: any;
  proposerType: any;
  isNotShowNomineeDetails: boolean = false;
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
  vehicleMMVData: any;
  vehicleMMVValue: any;
  productTypeValue: any;

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
          (isCpa?.add_on_code === 'CPA' || 'CPA3') &&
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

  /**
   * get ckyc data
   */
  getProceedData(data: any) {
    this.proceedData = data;
    if (data) {
      this.step1 = false;
      this.step2 = true;
      // this.showVehicleOwnerDetails = true;
    }
  }
  vehicleOwnerDetailsData(data: any) {
    if (data) {
      this.step2 = false;
      this.step3 = true;
    }
  }
  nomineeDetailsData(data: any) {
    if (data) {
      this.step3 = false;
      this.step4 = true;
    }
  }
  proposerVehicleDetailsData(data: any) {
    if (data) {
      this.step4 = false;
      this.step5 = true;
    }
  }
  getVehicleOwnerData(data: any) {
    if (data) {
      // this.showNomineeDetails = true;
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
    // this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    // this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
    // if (this.vehicleMMVValue?.policy_expiry_date === 'Not Sure') {

    // }
  }
}
