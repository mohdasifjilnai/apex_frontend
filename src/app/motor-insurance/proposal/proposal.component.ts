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
  isNotShowNomineeDetails: boolean = true;
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
    if (this.vehicleType === 'new') {
      this.isNotShowInNewPolicyDetails = false;
    }
    this.proposerType = sessionStorage.getItem('proposerType');
    if (this.proposerType === 'corporate') {
      this.isNotShowNomineeDetails = false;
    } else {
      this.isNotShowNomineeDetails = true;
    }
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      if (
        proposal?.ckyc_details !== null &&
        this.quoteData['insurer_code'] === 'digit'
      ) {
        this.showVehicleOwnerDetails = true;
        this.accordianExpanded = 'vehicleOwnerDetails';
      } else if (
        proposal?.ckyc_details !== null &&
        !this.quoteData['insurer_code']
      ) {
        this.showVehicleOwnerDetails = true;
      }
      if (
        proposal.customer_details !== null &&
        this.proposerType === 'corporate'
      ) {
        this.showVehicleDetails = true;
        this.accordianExpanded = 'vehicleDetails';
      } else if (
        proposal.customer_details !== null &&
        this.proposerType !== 'corporate'
      ) {
        this.showNomineeDetails = true;
        this.showVehicleOwnerDetails = true;

        this.accordianExpanded = 'nomineeDetails';
      }
      if (proposal.nominee_details !== null) {
        this.showVehicleDetails = true;
        this.accordianExpanded = 'vehicleDetails';
      }
      if (proposal.vehicle_details !== null && this.vehicleType === 'new') {
        this.showPreviousPolicyDetails = true;
        this.accordianExpanded = 'vehicleDetails';
      } else if (
        proposal.vehicle_details !== null &&
        this.vehicleType !== 'new'
      ) {
        this.accordianExpanded = 'previousPolicyDetails';
      }
    });
    this.sharedData.fetchKycData.subscribe((data) => {
      if (data) {
        this.showVehicleOwnerDetails = true;
        this.accordianExpanded = 'vehicleOwnerDetails';
      }
    });
  }

  ngAfterViewInit() {
    this.sharedData.getProposalReviewDetails.subscribe((res) => {
      if (res === 'previousPolicyDetailsPanel') {
        let el = this.previousPolicyDetailsPanel.nativeElement;
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 5000);
        } else {
          console.error('Element not found: previousPolicyDetailsPanel');
        }
      }
      if (res === 'vehilceOwnerPanel') {
        let el = this.vehilceOwnerPanel.nativeElement;
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 5000);
        } else {
        }
      }
      if (res === 'nomineDetailsPanel') {
        let el = this.nomineDetailsPanel.nativeElement;
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 5000);
        } else {
        }
      }
      if (res === 'vehicleDetailPanel') {
        let el = this.vehicleDetailPanel.nativeElement;
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 5000);
        } else {
          console.error('Element not found: vehicleDetailPanel');
        }
      }
    });
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
}
