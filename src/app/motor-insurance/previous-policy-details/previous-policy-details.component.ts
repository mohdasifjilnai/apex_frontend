import { DatePipe } from '@angular/common';
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
  url = '';
  renewalDetails: any;
  renewalQuotesRequest: any;
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
  isOdPolicyDetails: boolean = false;
  tpStartminDate: any;
  tpEndminDate: any;
  fetchedKyc: any;
  tpStartmaxDate: any;
  tpEndmaxDate: any;
  vehicleTypeSelected: any;

  constructor(
    private router: Router,
    private sharedData: SharedDataService,
    private apiservice: ApiService,
    private datePipe: DatePipe
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
    this.vehicleTypeSelected = sessionStorage.getItem('vehicleType');
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      const [dayReg, monthReg, yearReg] =
        proposal?.vehicle_details?.registration_date.split('/').map(Number);
      const reformattedRegDate = new Date(yearReg, monthReg - 1, dayReg);
      this.tpStartminDate = reformattedRegDate;
      this.tpStartmaxDate = new Date();

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
      if (
        kycData?.insurer_code == this.quoteData?.insurer_code &&
        sessionStorage.getItem('proposerType') === kycData?.proposer_type &&
        proposal?.ckyc_details?.is_verification
      ) {
        this.isDisableCKyc = false;
      } else if (this.quoteData?.insurer_code == 'united_india') {
        if (proposal?.ckyc_details?.is_verification) {
          this.isDisableCKyc = false;
        }
      } else if (
        sessionStorage.getItem('proposerType') !== undefined &&
        this.fetchedKyc?.proposer_type !== undefined &&
        this.fetchedKyc.proposer_type !== null &&
        sessionStorage.getItem('proposerType') !== this.fetchedKyc.proposer_type
      ) {
        this.isDisableCKyc = true;
      } else if (this.fetchedKyc?.verification_status !== null) {
        this.isDisableCKyc = false;
      }

      let renewalDataType = sessionStorage.getItem('renewalType');
      if (renewalDataType == 'renewal') {
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
    let previousPolicyType = JSON.parse(
      sessionStorage.getItem('mmv_data') || '{}'
    );

    if (
      previousPolicyType?.policy_expiry === 'saod' ||
      previousPolicyType?.policy_expiry === 'comprehensive' ||
      previousPolicyType?.policy_expiry === 'bundle'
    ) {
      this.isTpPolicyDetails = true;
      this.isOdPolicyDetails = true;
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
      this.previousPolicyDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('previous_insurer')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('prev_policy_number')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('prev_policy_number')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    } else if (
      previousPolicyType?.policy_expiry === 'satp' ||
      previousPolicyType?.policy_expiry === 'bundled_tp'
    ) {
      this.isTpPolicyDetails = true;
      // this.isOdPolicyDetails = false;
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
      this.previousPolicyDetailsForm.get('previous_insurer')?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('previous_insurer')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('prev_policy_number')
        ?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('prev_policy_number')
        ?.updateValueAndValidity();
      this.previousPolicyDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([]);
      this.previousPolicyDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    }

    this.sharedData.renewalPreviousPolicyData.subscribe((data: any) => {
      if (data) {
        this.renewalDetails = sessionStorage.getItem('renewalDetails');
        const parsedRenewalDetails = JSON.parse(this.renewalDetails);
        if (parsedRenewalDetails) {
          this.renewalQuotesRequest = data.quote_request;
          if (
            this.renewalQuotesRequest?.product_type === 'saod' ||
            this.renewalQuotesRequest?.product_type === 'comprehensive' ||
            this.renewalQuotesRequest?.product_type === 'bundle'
          ) {
            this.isTpPolicyDetails = true;
            this.isOdPolicyDetails = true;
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
            this.previousPolicyDetailsForm
              .get('previous_insurer')
              ?.setValidators([Validators.required]);
            this.previousPolicyDetailsForm
              .get('previous_insurer')
              ?.updateValueAndValidity();
            this.previousPolicyDetailsForm
              .get('prev_policy_number')
              ?.setValidators([Validators.required]);
            this.previousPolicyDetailsForm
              .get('prev_policy_number')
              ?.updateValueAndValidity();
            this.previousPolicyDetailsForm
              .get('policy_expiry_date')
              ?.setValidators([Validators.required]);
            this.previousPolicyDetailsForm
              .get('policy_expiry_date')
              ?.updateValueAndValidity();
          } else if (
            this.renewalQuotesRequest?.product_type === 'satp' ||
            this.renewalQuotesRequest?.product_type === 'bundled_tp'
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
            this.previousPolicyDetailsForm
              .get('previous_insurer')
              ?.setValidators([]);
            this.previousPolicyDetailsForm
              .get('previous_insurer')
              ?.updateValueAndValidity();
            this.previousPolicyDetailsForm
              .get('prev_policy_number')
              ?.setValidators([]);
            this.previousPolicyDetailsForm
              .get('prev_policy_number')
              ?.updateValueAndValidity();
            this.previousPolicyDetailsForm
              .get('policy_expiry_date')
              ?.setValidators([]);
            this.previousPolicyDetailsForm
              .get('policy_expiry_date')
              ?.updateValueAndValidity();
          }
        }
      }
    });
    // else {
    //   this.previousPolicyDetailsForm
    //     .get('tp_insurance_company')
    //     ?.setValidators([]);
    //   this.previousPolicyDetailsForm
    //     .get('tp_insurance_company')
    //     ?.updateValueAndValidity();
    //   this.previousPolicyDetailsForm.get('tp_policy_number')?.setValidators([]);
    //   this.previousPolicyDetailsForm
    //     .get('tp_policy_number')
    //     ?.updateValueAndValidity();
    //   this.previousPolicyDetailsForm
    //     .get('tp_policy_start_date')
    //     ?.setValidators([]);
    //   this.previousPolicyDetailsForm
    //     .get('tp_policy_start_date')
    //     ?.updateValueAndValidity();
    //   this.previousPolicyDetailsForm
    //     .get('tp_policy_end_date')
    //     ?.setValidators([]);
    //   this.previousPolicyDetailsForm
    //     .get('tp_policy_end_date')
    //     ?.updateValueAndValidity();
    // }
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (Object.keys(kycData).length > 0) {
      if (
        kycData.insurer_code == this.quoteData?.insurer_code &&
        kycData.verification_status == true
      ) {
        this.isDisableCKyc = false;
      } else if (this.quoteData?.insurer_code === 'digit') {
        this.isDisableCKyc = false;
      } else if (this.fetchedKyc?.verification_status !== null) {
        this.isDisableCKyc = false;
      } else {
        this.isDisableCKyc = true;
      }
    }

    this.sharedData?.fetchedCkycData.subscribe((kyc) => {
      if (kyc) {
        this.fetchedKyc = kyc;
        this.isDisableCKyc = false;
      }
    });

    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType == 'renewal') {
      this.previousPolicyDetailsForm?.disable();
    }
  }
  onTpStartDateSelected(event: any) {
    this.previousPolicyDetailsForm
      .get('tp_policy_end_date')
      ?.updateValueAndValidity();
    this.previousPolicyDetailsForm.get('tp_policy_end_date')?.reset();
    const selectedDateValue = this.previousPolicyDetailsForm.get(
      'tp_policy_start_date'
    )?.value;
    if (selectedDateValue) {
      const EndMinDate = new Date(
        selectedDateValue.getFullYear() + 1,
        selectedDateValue.getMonth(),
        selectedDateValue.getDate() - 1
      );
      this.tpEndminDate = this.datePipe.transform(EndMinDate, 'yyyy-MM-dd')!;
      const selectedDate = new Date(selectedDateValue);
      if (this.vehicleTypeSelected == 'private_car') {
        const fourYearsFromNow = new Date(
          selectedDate.getFullYear() + 3,
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        this.tpEndmaxDate = this.datePipe.transform(
          fourYearsFromNow,
          'yyyy-MM-dd'
        )!;
      } else if (this.vehicleTypeSelected == 'two_wheeler') {
        const fourYearsFromNow = new Date(
          selectedDate.getFullYear() + 5,
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        this.tpEndmaxDate = this.datePipe.transform(
          fourYearsFromNow,
          'yyyy-MM-dd'
        )!;
      }
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
              `quotes/proposal/${this.transactionId}/review`,
            ]);
            /**
             * Unsubscribe after navigation to avoid repeated navigation
             */
            this.previousPolicyDetailsSubscription.unsubscribe();
          }
        });
    } else if (this.renewalType == 'renewal') {
      let url = `quotes/proposal/${this.transactionId}/review`;
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
