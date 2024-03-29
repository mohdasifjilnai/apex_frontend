import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-previous-policy-details',
  templateUrl: './previous-policy-details.component.html',
  styleUrls: ['./previous-policy-details.component.scss'],
})
export class PreviousPolicyDetailsComponent implements OnInit {
  insuranceCompanyList: any;
  transactionId: any;
  proposalData: any;
  vehicleType: any;
  quoteData: any;
  vehicleMMVData: any;
  vehicleMMVValue: any;
  isExpiryDate: boolean = false;
  isTpPolicyDetails: boolean = false;
  private previousPolicyDetailsSubscription!: Subscription;
  isDisabledPreviousPolicyDetails: boolean = false;
  @Input() fetchVehicleDetails: any;
  @Output() afterPreviousVehicleDetilsData = new EventEmitter<any>();

  previousPolicyDetailsForm: FormGroup = new FormGroup({
    prev_policy_number: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9\/\-]+$/),
    ]),
    previous_insurer: new FormControl('', Validators.required),
    policy_expiry_date: new FormControl('', Validators.required),
    tp_insurance_company: new FormControl(''),
    tp_policy_number: new FormControl(''),
    tp_policy_start_date: new FormControl(''),
    tp_policy_end_date: new FormControl(''),
  });

  constructor(
    private router: Router,
    private sharedData: SharedDataService,
    private apiservice: ApiService
  ) {
    this.insuranceCompanyList = [
      {
        id: 1,
        companyName: '',
      },
    ];
  }

  ngOnInit(): void {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (this.proposalData.previous_policy_details !== null) {
        this.previousPolicyDetailsForm.patchValue({
          prev_policy_number:
            this.proposalData.previous_policy_details?.policy_no,

          policy_expiry_date: this.sharedData.parseDate(
            this.proposalData.previous_policy_details?.policy_expiry_date,
            'DD/MM/YYYY'
          ),

          tp_policy_number:
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_no,
          tp_policy_start_date: moment(
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_start_date,
            'DD/MM/YYYY'
          ).toDate(),
          tp_policy_end_date: moment(
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_expiry_date,
            'DD/MM/YYYY'
          ).toDate(),
        });
        if (
          this.proposalData.previous_policy_details?.insurer_code ||
          this.proposalData.previous_policy_details?.tp_policy_details
            ?.tp_insurer_code
        ) {
          this.apiservice
            .getRequestedResponse(ApiConstants.get_previous_insurer)
            .subscribe((response: any) => {
              for (let insurer of response) {
                if (
                  insurer?.rb_insurer_code ===
                  this.proposalData.previous_policy_details?.insurer_code
                ) {
                  this.previousPolicyDetailsForm.patchValue({
                    previous_insurer: insurer,
                  });
                }
                if (
                  insurer?.rb_insurer_code ===
                  this.proposalData.previous_policy_details?.tp_policy_details
                    ?.tp_insurer_code
                ) {
                  this.previousPolicyDetailsForm.patchValue({
                    tp_insurance_company: insurer,
                  });
                }
              }
            });
        }
      } else {
        this.apiservice
          .getRequestedResponse(ApiConstants.get_previous_insurer)
          .subscribe((response: any) => {
            for (let insurer of response) {
              if (insurer?.rb_insurer_code === this.quoteData?.insurer_code) {
                this.previousPolicyDetailsForm.patchValue({
                  previous_insurer: insurer,
                  tp_insurance_company: insurer,
                });
              }
            }
          });
        this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
        this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
        if (this.vehicleMMVValue?.policy_expiry_date) {
          this.isExpiryDate = true;
          this.previousPolicyDetailsForm.patchValue({
            policy_expiry_date: this.vehicleMMVValue?.policy_expiry_date,
          });
        }
      }
    });
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    if (this.vehicleType !== 'new') {
      this.isDisabledPreviousPolicyDetails = true;
    }
    let productTypeValue = sessionStorage.getItem('productType');
    if (
      (this.quoteData?.is_breakin && productTypeValue === 'saod') ||
      (this.quoteData?.is_breakin && productTypeValue === 'comprehensive')
    ) {
      this.isTpPolicyDetails = true;
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('tp_policy_number')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('tp_policy_number')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('tp_policy_start_date')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('tp_policy_start_date')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('tp_policy_end_date')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('tp_policy_end_date')
        ?.updateValueAndValidity();
    } else {
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm.get('tp_policy_number')?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('tp_policy_number')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('tp_policy_start_date')
        ?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('tp_policy_start_date')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('tp_policy_end_date')
        ?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('tp_policy_end_date')
        ?.updateValueAndValidity();
    }
  }

  getPreviousVehicleData(isValid: any) {
    if (isValid) {
      const formValues = this.previousPolicyDetailsForm.value;
      this.afterPreviousVehicleDetilsData.emit(formValues);
      this.sharedData.createProposalId(
        'previous_policy_details',
        this.previousPolicyDetailsForm
      );
      /**
       * Unsubscribe before subscribing to avoid multiple subscriptions
       */
      if (this.previousPolicyDetailsSubscription) {
        this.previousPolicyDetailsSubscription.unsubscribe();
      }

      /**
       * subscribe to getProposalDetails and navigate after the response
       */
      this.previousPolicyDetailsSubscription =
        this.sharedData.getProposalDetails.subscribe((proposal) => {
          if (proposal.vehicle_details !== null) {
            this.router.navigate([
              `/motor/quotes/proposal/${this.transactionId}/review`,
            ]);
            /**
             * Unsubscribe after navigation to avoid repeated navigation
             */
            this.previousPolicyDetailsSubscription.unsubscribe();
          }
        });
    }
  }
  EnterKey(event: Event, manufacture: MatDatepicker<Date>) {
    this.sharedData.handleEnterKey(event, manufacture);
  }
}
