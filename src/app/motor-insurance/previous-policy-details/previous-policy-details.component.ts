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
  isExpiryDate: boolean = false;
  isTpPolicyDetails: boolean = false;
  mmvData: any;
  isDisableCKyc: boolean = false;
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
  previousInsurerResponse: any;
  renewalType: any;

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
    this.mmvData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
    if (this.mmvData?.policy_expiry_date) {
      this.isExpiryDate = true;
      this.previousPolicyDetailsForm.patchValue({
        policy_expiry_date: this.mmvData?.policy_expiry_date,
      });
    }

    this.transactionId = sessionStorage.getItem('transaction_id');
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (this.proposalData.previous_policy_details !== null) {
        this.previousPolicyDetailsForm.patchValue({
          prev_policy_number:
            this.proposalData.previous_policy_details?.policy_no,

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
        if (this.mmvData?.previous_insurer) {
          this.previousPolicyDetailsForm.patchValue({
            previous_insurer: this.mmvData?.previous_insurer,
            tp_insurance_company: this.mmvData?.previous_insurer,
          });
        }
      }
      let renewalDataType = sessionStorage.getItem('renewalType');
      if (renewalDataType) {
        const [day, month, year] =
          proposal?.previous_policy_details?.policy_expiry_date
            .split('/')
            .map(Number);
        const reformattedPolicyExpDate = new Date(year, month - 1, day);
        this.previousPolicyDetailsForm.patchValue({
          policy_expiry_date: reformattedPolicyExpDate,
        });
      }
    });
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    if (this.vehicleType !== 'new') {
      this.isDisabledPreviousPolicyDetails = true;
    }
    let productTypeValue = sessionStorage.getItem('productType');
    if (
      this.quoteData?.is_breakin ||
      productTypeValue === 'saod' ||
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
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (Object.keys(kycData).length > 0) {
      if (
        kycData.insurer_code == this.quoteData?.insurer_code &&
        kycData.verification_status == true
      ) {
        this.isDisableCKyc = false;
      } else if (this.quoteData?.insurer_code === 'digit') {
        this.isDisableCKyc = false;
      } else {
        this.isDisableCKyc = true;
      }
    }

    this.sharedData?.fetchedCkycData.subscribe((kyc) => {
      if (kyc) {
        this.isDisableCKyc = false;
      }
    });

    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType) {
      this.previousPolicyDetailsForm?.disable();
    }
  }

  getPreviousVehicleData(isValid: any) {
    if (isValid && this.renewalType != 'renewal') {
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
    } else if (this.renewalType == 'renewal') {
      let url = `/motor/quotes/proposal/${this.transactionId}/review`;
      this.router.navigate([url]);
    }
  }
  EnterKey(event: Event, manufacture: MatDatepicker<Date>) {
    this.sharedData.handleEnterKey(event, manufacture);
  }
  previousInsurerComponentResponse(response: string) {
    if (typeof response != 'object') {
      this.previousPolicyDetailsForm.setErrors({ invalidResponse: true });
    } else {
      this.previousInsurerResponse = response;
    }
  }
}
