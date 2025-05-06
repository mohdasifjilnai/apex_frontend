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
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { ErrorDialogComponent } from 'src/app/shared/components/dialog-components/error-dialog/error-dialog.component';
import { FailureDialogComponent } from 'src/app/shared/components/dialog-components/failure-dialog/failure-dialog.component';
declare const webengage: any;
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
  isTpStartDate: boolean = true;
  isTpEndDateDisable: boolean = false;
  private previousPolicyDetailsSubscription!: Subscription;
  isDisabledPreviousPolicyDetails: boolean = false;
  isOwnerAddressValidation: boolean = false;
  previousDetails: any;
  details: any;
  @Input() fetchVehicleDetails: any;
  @Output() afterPreviousVehicleDetilsData = new EventEmitter<any>();
  private getCustomerIdDetails!: Subscription;
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
  tpFormattedDate: any;
  partnerCodewithTraceId: any;
  isExistCustomerId: any;
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
  constructor(
    private router: Router,
    private sharedData: SharedDataService,
    private apiservice: ApiService,
    private datePipe: DatePipe,
    private matDialog: WindowRef
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
    if (this.mmvData?.policy_expiry === 'comprehensive') {
      this.isTpStartDate = false;
      this.isTpEndDateDisable = true;
      if (this.mmvData?.policy_expiry_date) {
        this.previousPolicyDetailsForm.patchValue({
          tp_policy_end_date: this.mmvData?.policy_expiry_date,
        });
      }
      const selectedDateValue =
        this.previousPolicyDetailsForm.get('tp_policy_end_date')?.value;
      const selectedDateNewValue = new Date(selectedDateValue);
      const inputDate = new Date(selectedDateNewValue);
      const outputDate = new Date(
        inputDate.getFullYear() - 1,
        inputDate.getMonth(),
        inputDate.getDate() + 1
      ); // Add 1 day
      this.tpFormattedDate = this.datePipe.transform(
        outputDate,
        "EEE MMM dd yyyy HH:mm:ss 'GMT'Z"
      );
      this.previousPolicyDetailsForm.patchValue({
        tp_policy_start_date: new Date(this.tpFormattedDate),
      });
    } else {
      this.isExpiryDate = true;
      if (this.mmvData?.policy_expiry_date) {
        this.previousPolicyDetailsForm.patchValue({
          policy_expiry_date: new Date(this.mmvData?.policy_expiry_date),
        });
      }
    }
    this.sharedData.getVahaanDetails.subscribe((res: any) => {
      if (res?.previous_policy_number != null) {
        this.previousPolicyDetailsForm.patchValue({
          tp_policy_number: res?.previous_policy_number,
        });
      }
    });
    this.sharedData?.getRenewalValue.subscribe((data) => {
      if (data) {
        const previousPolicyData =
          data?.previous_policy_details?.previous_policy_details;
        this.previousPolicyDetailsForm.patchValue({
          prev_policy_number: previousPolicyData?.policy_no,
          previous_insurer: previousPolicyData?.insurer_code,
          policy_expiry_date: previousPolicyData?.policy_expiry_date,
          tp_insurance_company:
            previousPolicyData?.tp_policy_details?.tp_insurer_code,
          tp_policy_number: previousPolicyData?.tp_policy_details?.tp_policy_no,
          tp_policy_start_date:
            previousPolicyData?.tp_policy_details?.tp_policy_start_date,
          tp_policy_end_date:
            previousPolicyData?.tp_policy_details?.tp_policy_expiry_date,
        });
        this.apiservice
          .getRequestedResponse(ApiConstants.get_previous_insurer())
          .subscribe((response: any) => {
            for (let insurer of response) {
              if (
                insurer?.rb_insurer_code ===
                data?.vehicle_details?.previous_insurer_code
              ) {
                this.previousPolicyDetailsForm.patchValue({
                  previous_insurer: insurer,
                });
              }
              if (
                insurer?.rb_insurer_code ===
                data.previous_policy_details?.previous_policy_details
                  ?.tp_policy_details?.tp_insurer_code
              ) {
                this.previousPolicyDetailsForm.patchValue({
                  tp_insurance_company: insurer,
                });
              }
            }
          });
      }
    });
    this.previousDetails = sessionStorage.getItem('RenewalPreviousDetails');
    if (this.previousDetails != null) {
      this.details = JSON.parse(this.previousDetails);
      const previousPolicyDetails =
        this.details?.previous_policy_details?.previous_policy_details;
      this.previousPolicyDetailsForm.patchValue({
        prev_policy_number: previousPolicyDetails?.policy_no,
        previous_insurer: previousPolicyDetails?.insurer_code,
        policy_expiry_date: previousPolicyDetails?.policy_expiry_date,
        tp_insurance_company:
          previousPolicyDetails?.tp_policy_details?.tp_insurer_code,
        tp_policy_number:
          previousPolicyDetails?.tp_policy_details?.tp_policy_no,
        tp_policy_start_date:
          previousPolicyDetails?.tp_policy_details?.tp_policy_start_date,
        tp_policy_end_date:
          previousPolicyDetails?.tp_policy_details?.tp_policy_expiry_date,
      });
      this.apiservice
        .getRequestedResponse(ApiConstants.get_previous_insurer())
        .subscribe((response: any) => {
          for (let insurer of response) {
            if (
              insurer?.rb_insurer_code ===
              this.details?.vehicle_details?.previous_insurer_code
            ) {
              this.previousPolicyDetailsForm.patchValue({
                previous_insurer: insurer,
              });
            }
            if (
              insurer?.rb_insurer_code ===
              this.details.previous_policy_details?.previous_policy_details
                ?.tp_policy_details?.tp_insurer_code
            ) {
              this.previousPolicyDetailsForm.patchValue({
                tp_insurance_company: insurer,
              });
            }
          }
        });
    }
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    this.vehicleTypeSelected = sessionStorage.getItem('vehicleType');
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (proposal?.vehicle_details) {
        const [dayReg, monthReg, yearReg] =
          proposal.vehicle_details.registration_date.split('/').map(Number);
        const registrationDate = new Date(yearReg, monthReg - 1, dayReg);
        const sixMonthsBackDate = new Date(registrationDate);
        sixMonthsBackDate.setMonth(sixMonthsBackDate.getMonth() - 6);

        this.tpStartminDate = sixMonthsBackDate;
        // this.tpStartmaxDate = registrationDate;
        const currentDate = new Date();
        const maxDateOffset = 0; //add days to current date
        this.tpStartmaxDate = this.getDateOffset(currentDate, maxDateOffset);
      }
      if (this.proposalData.previous_policy_details !== null) {
        const formatDate = (dateString: string) => {
          if (!dateString) return null;
          const [day, month, year] = dateString.split('/');
          const date = new Date(+year, +month - 1, +day);
          return this.datePipe.transform(date, 'yyyy-MM-dd');
        };
        this.previousPolicyDetailsForm.patchValue({
          prev_policy_number:
            this.proposalData.previous_policy_details?.policy_no,
          policy_expiry_date: formatDate(
            this.proposalData.previous_policy_details?.policy_expiry_date
          ),
          tp_policy_number:
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_no,
          tp_policy_start_date: formatDate(
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_start_date
          ),
          tp_policy_end_date: formatDate(
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_expiry_date
          ),
        });

        if (this.mmvData?.policy_expiry !== 'comprehensive') {
          this.previousPolicyDetailsForm.patchValue({
            tp_policy_start_date:
              this.previousPolicyDetailsForm.value?.tp_policy_start_date,
          });
          if (
            this.proposalData.previous_policy_details?.tp_policy_details
              ?.tp_policy_start_date
          ) {
            const selectedDateValue = this.previousPolicyDetailsForm.get(
              'tp_policy_start_date'
            )?.value;
            if (selectedDateValue) {
              const EndMinDate = new Date(
                selectedDateValue.getFullYear() + 1,
                selectedDateValue.getMonth(),
                selectedDateValue.getDate() - 1
              );
              this.tpEndminDate = this.datePipe.transform(
                EndMinDate,
                'yyyy-MM-dd'
              )!;
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
          this.previousPolicyDetailsForm.patchValue({
            tp_policy_end_date:
              this.previousPolicyDetailsForm.value?.tp_policy_end_date,
          });
        }

        if (
          this.proposalData.previous_policy_details?.insurer_code ||
          this.proposalData.previous_policy_details?.tp_policy_details
            ?.tp_insurer_code
        ) {
          this.apiservice
            .getRequestedResponse(ApiConstants.get_previous_insurer())
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
        if (this.mmvData?.previous_insurer && this.renewalType != 'renewal') {
          this.previousPolicyDetailsForm.patchValue({
            previous_insurer: this.mmvData?.previous_insurer,
            tp_insurance_company: this.mmvData?.previous_insurer,
          });
        }
        if (this.mmvData?.previous_insurer && this.renewalType == 'renewal') {
          this.previousPolicyDetailsForm.patchValue({
            previous_insurer: this.mmvData?.previous_insurer,
            // tp_insurance_company: this.mmvData?.previous_insurer,
          });
        }
      }
      // let previous_insurer=JSON.parse(sessionStorage.getItem('previous_insurerCode') || '')
      // if (
      //   kycData?.insurer_code == this.quoteData?.insurer_code &&
      //   sessionStorage.getItem('proposerType') === kycData?.proposer_type &&
      //   proposal?.ckyc_details?.is_verification
      // ) {
      //   this.isDisableCKyc = false;

      // } else
      if (this.quoteData?.insurer_code == 'united_india') {
        if (proposal?.ckyc_details?.is_verification) {
          this.isDisableCKyc = false;
        }
      }
      if (proposal?.insurer_code != 'digit') {
        if (proposal?.ckyc_details?.is_verification) {
          this.isDisableCKyc = false;
        } else {
          this.isDisableCKyc = true;
        }
      } else {
        this.isDisableCKyc = false;
      }
      if (
        this.proposalData?.ckyc_details == null &&
        this.proposalData?.customer_details == null
      ) {
        this.isDisableCKyc = true;
      }
      // else if (
      //   sessionStorage.getItem('proposerType') !== undefined &&
      //   this.fetchedKyc?.proposer_type !== undefined &&
      //   this.fetchedKyc.proposer_type !== null &&
      //   sessionStorage.getItem('proposerType') !== this.fetchedKyc.proposer_type
      // ) {
      //   this.isDisableCKyc = true;

      // }else if(previous_insurer==this.proposalData?.insurer_code){
      //   this.isDisableCKyc = false;
      // }
      //  else if (
      //   this.fetchedKyc?.verification_status !== null &&
      //   this.fetchedKyc?.verification_status !== undefined
      // ) {
      //   this.isDisableCKyc = false;
      // }else{
      //   this.isDisableCKyc=true
      // }

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
    this.sharedData?.getOwnnerAddres?.subscribe((ownerAddres) => {
      if (ownerAddres) {
        this.isOwnerAddressValidation = false;
      } else {
        this.isOwnerAddressValidation = true;
      }
      // if (this.maxlength < ownerAddres.length) {
      //   // this.sharedDataService?.sendOwnnerAddres(this.addresLength);
      //   this.isOwnerAddressValidation = true;
      // } else {
      //   this.isOwnerAddressValidation = false;
      // }
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
    } else if (previousPolicyType?.policy_expiry === 'comprehensive') {
      this.isTpPolicyDetails = true;
      this.isOdPolicyDetails = false;
      this.previousPolicyDetailsForm.get('previous_insurer')?.setValidators([]);
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
          } else if (
            this.renewalQuotesRequest?.product_type === 'comprehensive'
          ) {
            this.isTpPolicyDetails = true;
            this.isOdPolicyDetails = false;
            this.previousPolicyDetailsForm
              .get('previous_insurer')
              ?.setValidators([]);
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

    // prev_policy_number: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern(/^[a-zA-Z0-9\/\-]+$/),
    // ]),
    // previous_insurer: new FormControl('', Validators.required),
    // policy_expiry_date: new FormControl('', Validators.required),
    // tp_insurance_company: new FormControl(''),
    // tp_policy_number: new FormControl(''),
    // tp_policy_start_date: new FormControl(''),
    // tp_policy_end_date: new FormControl(''),

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
    // const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    // if (Object.keys(kycData).length > 0) {
    //   if (
    //     kycData.insurer_code == this.quoteData?.insurer_code &&
    //     kycData.verification_status == true
    //   ) {
    //     this.isDisableCKyc = false;

    //   } else if (this.quoteData?.insurer_code === 'digit') {
    //     this.isDisableCKyc = false;

    //   } else if (
    //     this.fetchedKyc?.verification_status !== null &&
    //     this.fetchedKyc?.verification_status !== undefined
    //   ) {
    //     this.isDisableCKyc = false;

    //   } else {
    //     this.isDisableCKyc = true;

    //   }
    // }

    // this.sharedData?.fetchedCkycData.subscribe((kyc) => {
    //   if (kyc) {
    //     this.fetchedKyc = kyc;
    //     this.isDisableCKyc = false;

    //   }
    // });

    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType == 'renewal' || this.renewalType == 'rollover') {
      this.previousPolicyDetailsForm?.disable();
      this.previousPolicyDetailsForm.get('prev_policy_number')?.enable();
      this.previousPolicyDetailsForm.get('tp_policy_start_date')?.enable();
      this.previousPolicyDetailsForm.get('tp_policy_end_date')?.enable();
      this.previousPolicyDetailsForm.get('tp_policy_number')?.enable();
      this.previousPolicyDetailsForm.get('policy_expiry_date')?.enable();
      this.isTpEndDateDisable = false;
    }

    this.getCustomerIdDetails = this.sharedData.getCustomerId.subscribe(
      (idValue) => {
        if (idValue == 'Previous Policy Details') {
          const vehcileType = sessionStorage.getItem('vehicleType');
          const transforPolicyStart = this.previousPolicyDetailsForm.value
            ?.tp_policy_start_date
            ? this.datePipe.transform(
                this.previousPolicyDetailsForm.value?.tp_policy_start_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';
          let policyStartDate = transforPolicyStart
            ? new Date(transforPolicyStart as string)
            : '';

          const transforPolicyEnd = this.previousPolicyDetailsForm.value
            ?.tp_policy_end_date
            ? this.datePipe.transform(
                this.previousPolicyDetailsForm.value?.tp_policy_end_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';
          let policyEndDate = transforPolicyEnd
            ? new Date(transforPolicyEnd as string)
            : '';

          const transformedPolicyExpiry = this.previousPolicyDetailsForm.value
            ?.policy_expiry_date
            ? this.datePipe.transform(
                this.previousPolicyDetailsForm.value?.policy_expiry_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';
          let policyExpDate = transformedPolicyExpiry
            ? new Date(transformedPolicyExpiry as string)
            : '';
          let vehicleProposalDetails = this.quoteData;
          let previousPolicyWebengage = {
            User_Type: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
            Motor_Type: vehcileType,
            OD_Insurance_Company:
              this.previousPolicyDetailsForm.value?.previous_insurer
                ?.rb_insurer_name,
            OD_Policy_Number:
              this.previousPolicyDetailsForm.value?.prev_policy_number,
            Policy_expiry_date: policyExpDate,
            TP_Policy_details:
              this.previousPolicyDetailsForm.value?.tp_insurance_company
                ?.rb_insurer_name,
            TP_Policy_Number:
              this.previousPolicyDetailsForm.value?.tp_policy_number,
            TP_Policy_Start_Date: policyStartDate,
            TP_Policy_End_Date: policyEndDate,
            Insurer_Name: vehicleProposalDetails?.insurer_name,
            Total_IDV: vehicleProposalDetails?.premium_details?.idv,
            Total_Premium:
              vehicleProposalDetails?.premium_details?.gross_premium,
            Insurer_Logo: vehicleProposalDetails?.insurer_logo,
            Product_id: vehicleProposalDetails?.quote_id,
            Customer_id: idValue.customer_id,
            Perform_by: sessionStorage.getItem('partner_code')
              ? 'Partner'
              : 'Customer',
            Partner_Name:
              sessionStorage.getItem('first_name') != null
                ? `${sessionStorage.getItem(
                    'first_name'
                  )} ${sessionStorage.getItem(
                    'middle_name'
                  )} ${sessionStorage.getItem('last_name')}`
                : '',
            Partner_id: sessionStorage.getItem('partner_code'),
          };
          const filteredData = Object.fromEntries(
            Object.entries(previousPolicyWebengage).filter(([key, value]) => {
              if (value == null || value === '') {
                return false;
              }
              return true;
            })
          );
          webengage.track('Previous_Policy_details_Submitted', filteredData);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.getCustomerIdDetails.unsubscribe();
  }
  onTpStartDateSelected(event: any) {
    if (this.mmvData?.policy_expiry === 'comprehensive') {
    } else {
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
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.setValidators([Validators.required]);
      this.previousPolicyDetailsForm
        .get('tp_insurance_company')
        ?.updateValueAndValidity();
    }
  }
  onPolicyNumberChange() {
    this.previousPolicyDetailsForm
      .get('tp_insurance_company')
      ?.setValidators([Validators.required]);
    this.previousPolicyDetailsForm
      .get('tp_insurance_company')
      ?.updateValueAndValidity();
  }
  onOdPolicyNumberChange() {
    this.previousPolicyDetailsForm
      .get('previous_insurer')
      ?.setValidators([Validators.required]);
    this.previousPolicyDetailsForm
      .get('previous_insurer')
      ?.updateValueAndValidity();
  }
  getPreviousVehicleData(isValid: any) {
    const proposal_id = sessionStorage.getItem('proposal_Id');
    this.sharedData.crossSellRecomendation(proposal_id);
    const vehcileType = sessionStorage.getItem('vehicleType');
    let partnerCode = sessionStorage.getItem('partner_code');
    // webengage.track('Previous_Policy_details_Submitted', {
    //   Option_Selected: vehcileType,
    //   User_Type: sessionStorage.getItem('partner_code')
    //     ? sessionStorage.getItem('partner_code')
    //     : null,
    //   Motor_Type: vehcileType,
    // });
    if (!partnerCode) {
      this.partnerCodewithTraceId = JSON.parse(
        sessionStorage.getItem('partnerCodeTraceId') || '{}'
      );
      if (this.partnerCodewithTraceId?.partner_code) {
        partnerCode = this.partnerCodewithTraceId?.partner_code;
      }
    }
    if (isValid) {
      this.apiservice
        .getRequestedResponse(
          `${
            ApiConstants.renewal_partner_validation
          }?vehicle_type=${vehcileType}&proposal_id=${proposal_id}&registration_num=${
            this.proposalData?.vehicle_details?.registration_no
          }&partner_code=${partnerCode ? partnerCode : ''}`
        )
        .subscribe((res) => {
          if (res?.status) {
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
          } else {
            this.failureJSON['modalName'] = FailureDialogComponent;
            this.openFailurePopup(res);
          }
        });
    } else if (this.renewalType == 'renewal') {
      let url = `quotes/proposal/${this.transactionId}/review`;
      this.router.navigate([url]);
    }

    this.isExistCustomerId = sessionStorage.getItem('webengageCustomerId');
    let CheckId = JSON.parse(this.isExistCustomerId);
    if (CheckId) {
      const transforPolicyStart = this.previousPolicyDetailsForm.value
        ?.tp_policy_start_date
        ? this.datePipe.transform(
            this.previousPolicyDetailsForm.value?.tp_policy_start_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';
      let policyStartDate = transforPolicyStart
        ? new Date(transforPolicyStart as string)
        : '';

      const transforPolicyEnd = this.previousPolicyDetailsForm.value
        ?.tp_policy_end_date
        ? this.datePipe.transform(
            this.previousPolicyDetailsForm.value?.tp_policy_end_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';
      let policyEndDate = transforPolicyEnd
        ? new Date(transforPolicyEnd as string)
        : '';

      const transformedPolicyExpiry = this.previousPolicyDetailsForm.value
        ?.policy_expiry_date
        ? this.datePipe.transform(
            this.previousPolicyDetailsForm.value?.policy_expiry_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';
      let policyExpDate = transformedPolicyExpiry
        ? new Date(transformedPolicyExpiry as string)
        : '';
      let vehicleProposalDetails = this.quoteData;
      let previousPolicyWebengage = {
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: vehcileType,
        OD_Insurance_Company:
          this.previousPolicyDetailsForm.value?.previous_insurer
            ?.rb_insurer_name,
        OD_Policy_Number:
          this.previousPolicyDetailsForm.value?.prev_policy_number,
        Policy_expiry_date: policyExpDate,
        TP_Policy_details:
          this.previousPolicyDetailsForm.value?.tp_insurance_company
            ?.rb_insurer_name,
        TP_Policy_Number:
          this.previousPolicyDetailsForm.value?.tp_policy_number,
        TP_Policy_Start_Date: policyStartDate,
        TP_Policy_End_Date: policyEndDate,
        Insurer_Name: vehicleProposalDetails?.insurer_name,
        Total_IDV: vehicleProposalDetails?.premium_details?.idv,
        Total_Premium: vehicleProposalDetails?.premium_details?.gross_premium,
        Insurer_Logo: vehicleProposalDetails?.insurer_logo,
        Product_id: vehicleProposalDetails?.quote_id,
        Customer_id: CheckId.customer_id,
        Perform_by: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Partner_Name:
          sessionStorage.getItem('first_name') != null
            ? `${sessionStorage.getItem('first_name')} ${sessionStorage.getItem(
                'middle_name'
              )} ${sessionStorage.getItem('last_name')}`
            : '',
        Partner_id: sessionStorage.getItem('partner_code'),
      };
      const filteredData = Object.fromEntries(
        Object.entries(previousPolicyWebengage).filter(([key, value]) => {
          if (value == null || value === '') {
            return false;
          }
          return true;
        })
      );
      webengage.track('Previous_Policy_details_Submitted', filteredData);
    } else {
      let mobileNumber = sessionStorage.getItem('mobileNumber');
      this.sharedData.getCustomerIdForwebengae(
        mobileNumber,
        '',
        'Previous Policy Details'
      );
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

  getDateOffset(date: Date, offset: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + offset);
    return result;
  }
  openFailurePopup(objData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 999) {
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
}
