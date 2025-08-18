import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { HttpService } from 'src/app/core/services/http.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { NotCertifiedComponent } from 'src/app/shared/components/dialog-components/not-certified/not-certified.component';
declare const webengage: any;

@Component({
  selector: 'app-vehicle-details-popup-new',
  templateUrl: './vehicle-details-popup-new.component.html',
  styleUrls: ['./vehicle-details-popup-new.component.scss'],
})
export class VehicleDetailsPopupNewComponent implements OnInit {
  editVehicleDetails: boolean = false;
  private destroy$ = new Subject<void>();
  vehicleDetailsForm!: FormGroup;
  url = 'quotes';
  vehicleTypeValue: any;
  editVehiclePatch: boolean = false;
  showErrorMessage: boolean = true;
  vehcileModelDetails: any;
  traceIdResponse: any;
  makeValueSelected: any;
  modelValueSelected: any;
  variantValueSelected: any;
  showSelectedFuelandCapacity: boolean = false;
  cubicCapacitor: any;
  fuelList: any;
  makeList: any;
  modelList: any;
  variantList: any;
  cityList: any;
  rtoList: any;
  mmvData: any;
  rtoSelected: any;
  selectedRTO: any;
  trace_id: any;
  vehicleMakeOninit = true;
  vehicleModelOninit = true;
  vehicleVariantOnint = true;
  fuelArray: any;
  isNewVehicle: boolean = true;
  expiring_policy_type: any;
  manufactureDateObject: any;
  rcList: { id: number; rcName: string; value: boolean }[];
  expiryListData: any;
  ncbDiscount: any;
  claimedList: { id: number; claimedName: string; value: boolean }[];
  regDateObj: any;
  expiryList: any;
  ncbListData: any;
  bussiness_type: any;
  registrationNumber: any;
  registrationNumberData: any;
  makeDataNotAvailable: boolean = false;
  modelDataNotAvailable: boolean = false;
  variantDataNotAvailable: boolean = false;
  renewalData: any;
  coverageType: any;
  iDKSelected: boolean = false;
  hidePreviousClaimed: boolean = false;
  traceIdAllData: any;
  is_renewal: boolean = false;
  notCertifiedComponentJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NotCertifiedComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'not-certifiedComponent-class',
  };
  rtoInvalid: boolean = false;
  mmvBaseButtonDisable: boolean = false;
  vehiclePopupList: any;

  renewalType: any;
  showExpiryDateErrorMessage: boolean = false;
  ExpiryPolicyType: any;
  journeyType: any;
  vehcileFormData: any;
  renewalPopup: any;
  policyExpiryDate: any;
  editButton = false;
  renewalVehicleDetails: any;
  stateCode: any;
  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsPopupNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedDataService: SharedDataService,
    private apiservice: ApiService,
    public bottomSheetRef: MatBottomSheetRef<VehicleDetailsPopupNewComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomsheetData: any,
    private renderer: Renderer2,
    public router: Router,
    private FormBuilder: FormBuilder,
    private datePipe: DatePipe,
    private matDialog: WindowRef
  ) {
    /**
     * Sample data for the Used Car/RC Transfer dropdown list
     */
    this.rcList = [
      {
        id: 1,
        rcName: 'Yes',
        value: true,
      },
      {
        id: 2,
        rcName: 'No',
        value: false,
      },
    ];

    /**
     * Sample data for the Is Previous Policy Claimed dropdown list
     */
    this.claimedList = [
      {
        id: 1,
        claimedName: 'Yes',
        value: true,
      },
      {
        id: 2,
        claimedName: 'No',
        value: false,
      },
    ];
    this.vehicleDetailsFormControler();
    this.trace_id = this.sharedDataService.traceIdResponse?.trace_id;
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.journeyType = sessionStorage.getItem('journeyType');
  }

  ngOnInit(): void {
    let traceIDData =
      this.sharedDataService.traceIdResponse?.quote_data?.quotes_data;
    this.traceIdAllData = traceIDData;
    this.bussiness_type =
      this.sharedDataService.traceIdResponse?.quote_data?.bussiness_type;
    this.cubicCapacitor = traceIDData?.vehicle?.cubic_capacity;
    this.makeValueSelected = traceIDData?.vehicle?.rb_make_name;
    this.modelValueSelected = traceIDData?.vehicle?.rb_model_name;
    this.variantValueSelected = traceIDData?.vehicle?.rb_variant_name;
    this.sharedDataService.getRegistrationDate(traceIDData?.registration_date);

    if (traceIDData && this.registrationNumberData == null) {
      this.vehicleVariant(traceIDData?.vehicle?.rb_variant_name, true);
      this.patchVehicleDetailsForm(traceIDData, this.bussiness_type);
    } else if (this.registrationNumberData == null) {
      let partnerCodetrace_id = JSON.parse(
        sessionStorage.getItem('partnerCodeTraceId') || '{}'
      );
      this.trace_id = partnerCodetrace_id?.trace_id;

      let traceIDData = partnerCodetrace_id?.quote_data?.quotes_data;
      this.bussiness_type = partnerCodetrace_id?.quote_data?.bussiness_type;
      this.makeValueSelected = traceIDData?.vehicle?.rb_make_name;
      this.modelValueSelected = traceIDData?.vehicle?.rb_model_name;
      this.variantValueSelected = traceIDData?.vehicle?.rb_variant_name;
      this.cubicCapacitor = traceIDData?.vehicle?.cubic_capacity;
      this.vehicleVariant(traceIDData?.vehicle?.rb_variant_name, true);
      this.patchVehicleDetailsForm(traceIDData, this.bussiness_type);
    }
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    if (window.innerWidth <= 999) {
      this.vehcileFormData = this.bottomsheetData;
    } else {
      this.vehcileFormData = this.data?.data;
    }
    if (this.vehcileFormData?.dialog_type == 'edit') {
      this.editButton = true;
      this.editVehicleDetails = true;
      if (this.vehcileFormData?.value?.type_of_exp_policy_id != null) {
        this.isNewVehicle = false;
        this.bussiness_type = 'renewal';
        if (
          this.vehcileFormData?.value?.policy_expiry != 'satp' &&
          this.vehcileFormData?.value?.policy_expiry != 'bundled_tp' &&
          this.vehcileFormData?.value?.policy_expiry != 'IDK'
        ) {
          this.vehicleDetailsForm
            .get('ncb_discount')
            ?.setValidators([Validators.required]);
          this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
          this.vehicleDetailsForm
            .get('previous_insurer')
            ?.setValidators([Validators.required]);
          this.vehicleDetailsForm
            .get('previous_insurer')
            ?.updateValueAndValidity();
        }
      } else {
        this.bussiness_type = 'new';
      }
      this.makeValueSelected =
        this.vehcileFormData?.value?.vehicle_fuel?.rb_make_name;
      this.modelValueSelected =
        this.vehcileFormData?.value?.vehicle_fuel?.rb_model_name;
      this.variantValueSelected =
        this.vehcileFormData?.value?.vehicle_fuel?.rb_variant_name;
      this.vehicleVariant(
        this.vehcileFormData?.value?.vehicle_fuel?.rb_variant_name,
        true
      );
      this.stateCode =
        this.vehcileFormData?.value?.registration_city?.rb_rto_code?.slice(
          0,
          2
        );

      this.vehicleDetailsForm.patchValue({
        vehicle_make: this.vehcileFormData?.value?.vehicle_fuel?.rb_make_name,
        vehicle_model: this.vehcileFormData?.value?.vehicle_fuel?.rb_model_name,
        vehicle_variant:
          this.vehcileFormData?.value?.vehicle_fuel?.rb_variant_name,
        registration_rto: this.vehcileFormData?.value?.registration_city,
        registration_city: this.vehcileFormData?.value?.registration_city,
        vehicle_fuel: this.vehcileFormData?.value?.vehicle_fuel,
        type_of_exp_policy_id:
          this.vehcileFormData?.value?.type_of_exp_policy_id,
        ncb_discount: this.vehcileFormData?.value?.ncb_discount,
        registration_date: this.datePipe.transform(
          this.vehcileFormData?.value?.registration_date,
          'yyyy-MM-dd'
        ),
        // manufacture_date: new Date(this.vehcileFormData?.value?.manufacture_date),
        manufacture_date: this.datePipe.transform(
          this.vehcileFormData?.value?.manufacture_date,
          'yyyy-MM'
        ),
        previous_claimed: this.vehcileFormData?.value?.previous_claimed,
        user_car: this.vehcileFormData?.value?.user_car,
        previous_insurer: this.vehcileFormData?.value?.previous_insurer,
        policy_expiry_date: this.vehcileFormData?.value?.policy_expiry_date
          ? this.datePipe.transform(
              this.vehcileFormData?.value?.policy_expiry_date,
              'yyyy-MM-dd'
            )
          : '',
      });
      if (this.vehcileFormData?.dialog_type !== 'edit') {
        this.patchPreviousInsurer();
      }
      this.ncbDiscount = this.vehcileFormData?.value?.ncb_discount;
      sessionStorage.setItem(
        'registrationDetails',
        JSON.stringify(this.vehcileFormData?.value?.previous_insurer)
      );
      this.vehiclePopupList = sessionStorage.getItem('mmv_data');

      this.getExpiringPolicy(false);
      this.onExpiryPolicyChange(this.vehcileFormData?.value?.policy_expiry);
      setTimeout(() => {
        this.editButton = false;
      }, 4000);
    }

    this.sharedDataService.getRegistrationData.subscribe((res) => {
      const inputDate = new Date(res); // assumes value is in yyyy-MM or full date format
      const currentDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      if (inputDate < currentDate) {
        this.onRegistrationDateChange('rollover'); // custom function
      } else {
        this.onRegistrationDateChange('new');
      }
    });
    const registration_number = sessionStorage.getItem('registrationNumber');

    if (registration_number && !this.editVehicleDetails) {
      this.sharedDataService.vehicleDetails(registration_number);
    }
    this.sharedDataService.regNumberData.subscribe((numberData) => {
      if (
        numberData != null &&
        this.journeyType == 'registrationNumber' &&
        !this.editVehicleDetails
      ) {
        this.registrationNumberData = numberData;
        this.isNewVehicle = false;
        this.vehicleMMV(this.registrationNumberData?.rb_mmv_id);
        this.vehcileRegistration(
          this.registrationNumberData?.rb_rto_code,
          'rtoByRegistration'
        );
        this.vehicleDetailsForm.patchValue({
          registration_date: this.formatDDMMYYYYToDate(
            this.registrationNumberData?.vehicle_details?.registration_date
          ),
          manufacture_date: new Date(
            this.registrationNumberData?.vehicle_details?.manufacture_date
          ),
          // previous_claimed: this.registrationNumberData?.previous_claimed,
          previous_insurer: this.registrationNumberData?.previous_insurer_code,
          // policy_expiry_date: this.formatDDMMYYYYToDate(
          //   this.registrationNumberData?.previous_policy_exp_date
          // ),
        });
        if (this.registrationNumberData?.previous_policy_exp_date) {
          let inputDate = this.registrationNumberData?.previous_policy_exp_date;
          let [day, month, year] = inputDate.split('/');
          let reformattedDate = `${month}/${day}/${year}`;
          let parsedInputDate = new Date(reformattedDate);
          this.policyExpiryDate = this.datePipe.transform(
            parsedInputDate,
            'dd/MM/yyyy'
          );
          // Get the current date and add 60 days
          let currentDate = new Date();
          let futureDate = new Date();
          this.renewalType = sessionStorage.getItem('renewalType');
          const previousInsurer = sessionStorage.getItem('previousInsurer');
          if (
            (this.renewalType === 'rollover' ||
              this.renewalType == 'renewal') &&
            (previousInsurer == 'digit' || previousInsurer == 'hdfc_ergo')
          ) {
            futureDate.setDate(currentDate.getDate() + 91);
          } else {
            futureDate.setDate(currentDate.getDate() + 60);
          }
          if (parsedInputDate > futureDate) {
            if (this.vehcileFormData?.dialog_type != 'edit') {
              this.showExpiryDateErrorMessage = true;
            }
          } else {
            if (!this.vehiclePopupList) {
              this.vehicleDetailsForm.patchValue({
                policy_expiry_date: parsedInputDate,
              });
            }
          }
        }
        this.getExpiringPolicy(false);
        this.patchPreviousInsurer();
      }
    });

    // Renewal Details Data Patching

    const renewalType = sessionStorage.getItem('renewalType');
    if (renewalType == 'renewal') {
      this.is_renewal = true;
    }

    this.renewalPopup =
      this.sharedDataService.renewalDataResponseValue.subscribe((res: any) => {
        if (res && renewalType == 'renewal') {
          this.renewalData = res?.previous_policy_details?.vehicle_details;
          this.renewalVehicleDetails = res?.vehicle_details;
          this.is_renewal = true;
          this.coverageType =
            res?.previous_policy_details?.previous_policy_details?.renewal_coverage_type;
          if (this.coverageType != null) {
            this.showErrorMessage = false;
          }

          if (res?.vehicle_details?.rb_mmv_id) {
            this.vehicleMMV(res?.vehicle_details?.rb_mmv_id);
          }
          if (res?.vehicle_details?.rb_rto_code) {
            this.vehcileRegistration(
              res?.vehicle_details?.rb_rto_code,
              'rtoByRegistration'
            );
          }
          this.vehicleDetailsForm.patchValue({
            registration_date: this.renewalData?.registration_date,
            manufacture_date: this.renewalData?.manufacture_date,
            previous_insurer: res?.vehicle_details?.previous_insurer_code,
            policy_expiry_date: this.formatDDMMYYYYToDate(
              res?.vehicle_details?.previous_policy_exp_date
            ),
            policy_expiry: this.coverageType?.coverage_type_code,
          });

          this.patchPreviousInsurer();
          this.renewalData ? this.patchdate(this.renewalData) : '';
          res ? this.patchInsurer(res) : '';
          this.coverageType
            ? this.vehicleDetailsForm.patchValue({
                policy_expiry: this.coverageType?.coverage_type_code,
              })
            : '';
          if (this.vehicleDetailsForm.value.policy_expiry == 'satp') {
            this.iDKSelected = false;
            this.hidePreviousClaimed = true;
            this.vehicleDetailsForm.get('previous_claimed')?.clearValidators();
            this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
            this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
            this.vehicleDetailsForm
              .get('ncb_discount')
              ?.updateValueAndValidity();
            this.vehicleDetailsForm
              .get('previous_claimed')
              ?.updateValueAndValidity();
          } else {
            if (this.vehicleDetailsForm.value.policy_expiry != 'IDK') {
              this.vehicleDetailsForm
                .get('ncb_discount')
                ?.setValidators([Validators.required]);
              this.vehicleDetailsForm
                .get('ncb_discount')
                ?.updateValueAndValidity();
            }
          }
          this.getExpiringPolicy(true);
          if (res?.is_rb_renewal) {
            this.isNewVehicle = false;
            // this.sharedDataService.disableIfHasValueEnableIfEmpty(
            //   this.vehicleDetailsForm
            // );
          }
        }
      });
    // On Policy Expiry Date Changes
    this.sharedDataService.changePolicyExpDate
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.url == 'quotes') {
          this.getExpiringPolicy(true);
          if (res) {
            this.showExpiryDateErrorMessage = false;
          }
        }
      });

    this.sharedDataService.changeManufactureDate
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.url == 'quotes') {
          this.getExpiringPolicy(true);
        }
      });
    // this.sharedDataService.buttonDisabledPreviousInsurer.subscribe((res:any)=>{
    //   if(res){
    //     this.mmvBaseButtonDisable=res
    //   }
    // })
    this.vehicleDetailsForm
      .get('policy_expiry_date')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.showExpiryDateErrorMessage = false;
        }
      });

    // Renewal Details Data Patching
    // this.sharedDataService.renewalDataResponseValue.subscribe(
    //   (res: any ) => {
    //     if(res && renewalType=='renewal'){

    //     this.renewalData = res?.previous_policy_details?.vehicle_details;
    //     this.coverageType=res?.previous_policy_details?.previous_policy_details?.renewal_coverage_type
    //     if(this.coverageType!=null){
    //       this.showErrorMessage=false
    //     }
    //     if(res?.is_rb_renewal){
    //       this.isNewVehicle=false
    //       // this.sharedDataService.disableIfHasValueEnableIfEmpty(this.vehicleDetailsForm)
    //     }
    //     if(res?.vehicle_details?.rb_mmv_id){
    //       this.vehicleMMV(res?.vehicle_details?.rb_mmv_id)
    //     }
    //     if (res?.vehicle_details?.rb_rto_code) {
    //       this.vehcileRegistration(
    //         res?.vehicle_details?.rb_rto_code,
    //         'rtoByRegistration'
    //       );
    //     }
    //     this.vehicleDetailsForm.patchValue({
    //       registration_date: this.renewalData?.registration_date,
    //       manufacture_date: this.renewalData?.manufacture_date,
    //       previous_insurer: res?.vehicle_details?.previous_insurer_code,
    //       policy_expiry_date: this.formatDDMMYYYYToDate(
    //         res?.vehicle_details?.previous_policy_exp_date
    //       ),
    //       policy_expiry: this.coverageType.coverage_type_code,
    //     });
    //     this.getExpiringPolicy();
    //     }
    //   }
    // );
    this.onChangeCIty();
  }

  patchdate(renewalData: any) {
    this.vehicleDetailsForm.patchValue({
      registration_date: renewalData?.registration_date,
      manufacture_date: renewalData?.manufacture_date,
    });
  }

  patchInsurer(data: any) {
    this.vehicleDetailsForm.patchValue({
      previous_insurer: data?.vehicle_details?.previous_insurer_code,
      policy_expiry_date: this.formatDDMMYYYYToDate(
        data?.vehicle_details?.previous_policy_exp_date
      ),
    });
  }

  patchVehicleDetailsForm(traceIDData: any, business_type: any) {
    const registrationDate = new Date(traceIDData?.registration_date);
    const manufactureDate = new Date(
      registrationDate.getFullYear(),
      registrationDate.getMonth() - 1
    );
    this.vehicleDetailsForm.patchValue({
      registration_date: new Date(registrationDate),
    });
    if (!traceIDData?.manufacture_date) {
      this.vehicleDetailsForm.patchValue({
        manufacture_date: manufactureDate,
      });
    } else {
      this.vehicleDetailsForm.patchValue({
        manufacture_date: new Date(traceIDData?.manufacture_date),
      });
    }

    this.stateCode = traceIDData?.rto_city?.rb_rto_code?.slice(0, 2);
    if (business_type == 'new') {
      this.isNewVehicle = true;
      this.vehicleDetailsForm.patchValue({
        vehicle_make: traceIDData?.vehicle?.rb_make_name,
        vehicle_model: traceIDData?.vehicle?.rb_model_name,
        vehicle_variant: traceIDData?.vehicle?.rb_variant_name,
        registration_rto: traceIDData?.rto_city,
        registration_city: traceIDData?.rto_city,
        vehicle_fuel: traceIDData?.vehicle,
        registration_date: this.datePipe.transform(
          traceIDData?.registration_date,
          'yyyy-MM-dd'
        ),
      });
    } else if (business_type == 'renewal') {
      this.isNewVehicle = false;

      this.vehicleDetailsForm.patchValue({
        vehicle_make: traceIDData?.vehicle?.rb_make_name,
        vehicle_model: traceIDData?.vehicle?.rb_model_name,
        vehicle_variant: traceIDData?.vehicle?.rb_variant_name,
        registration_city: traceIDData?.rto_city,
        vehicle_fuel: traceIDData?.vehicle,
        previous_insurer: traceIDData?.previous_insurer,
        policy_expiry_date:
          traceIDData?.policy_expiry_date != 'Not Sure'
            ? this.datePipe.transform(
                traceIDData?.policy_expiry_date,
                'yyyy-MM-dd'
              )
            : '',
      });
      this.patchPreviousInsurer();
      sessionStorage.setItem(
        'registrationDetails',
        JSON.stringify(traceIDData?.previous_insurer)
      );
      this.sharedDataService.getRegistrationDate(
        traceIDData?.registration_date
      );

      this.vehicleDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('ncb_discount')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      if (
        traceIDData?.registration_date != null &&
        traceIDData?.registration_date != ''
      ) {
        this.getExpiringPolicy(false);
      }
    }
  }
  getTraceIdData(trace_id: any) {
    let apiUrl;
    apiUrl = `?trace_id=${trace_id}`;
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_trace_Id()}${apiUrl}`)
      .subscribe((res: any) => {
        if (res?.message == 'Partner not found') {
          this.openNotCertifiedPopup('');
        }
      });
  }

  onClose(): void {
    this.renderer.removeClass(document.body, 'dropdown-focus');
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.editVehiclePatch = false;
      this.dialogRef.close();
    }
  }

  /**
   * Initialize the form using FormBuilder
   */
  vehicleDetailsFormControler() {
    this.vehicleDetailsForm = this.FormBuilder.group({
      vehicle_make: ['', Validators.required],
      vehicle_model: ['', Validators.required],
      vehicle_variant: ['', Validators.required],
      vehicle_fuel: ['', Validators.required],
      registration_city: ['', Validators.required],
      registration_rto: ['', Validators.required],
      user_car: [false],
      policy_expiry_date: [''],
      policy_expiry: [''],
      previous_claimed: [false],
      ncb_discount: [''],
      manufacture_date: [moment(), Validators.required],
      registration_date: ['', Validators.required],
      previous_insurer: [''],
      vehicle_MMV: [''],
      type_of_exp_policy_id: [],
    });
  }

  /**
   *  this function use for get make listing
   */
  vehicleMake(make: any) {
    this.makeValueSelected = make.value;
    this.vehicleDetailsForm.get('vehicle_model')?.reset();
    this.vehicleDetailsForm.get('vehicle_variant')?.reset();
    this.vehicleDetailsForm.get('vehicle_fuel')?.reset();

    if (
      typeof this.makeValueSelected != 'object' &&
      this.makeValueSelected?.length >= 3
    ) {
      let apiData = `?product_name=${this.vehicleTypeValue}&make=${make.value}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
        .subscribe((res) => {
          if (res.message) {
            this.makeDataNotAvailable = true;
          } else {
            this.makeList = res;
            this.makeDataNotAvailable = false;
            this.variantDataNotAvailable = true;
          }
        });
    }
  }
  /**
   *  this function use for get make listing
   */
  vehicleMMV(mmv_id: any) {
    let apiData = `?product_name=${this.vehicleTypeValue}&rb_mmv_id=${mmv_id}`;
    if (mmv_id != null) {
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
        .subscribe((res) => {
          (this.makeValueSelected = res[0]?.rb_make_name),
            (this.modelValueSelected = res[0]?.rb_model_name),
            (this.variantValueSelected = res[0]?.rb_variant_name);
          this.fuelList = res;
          this.vehicleDetailsForm.patchValue({
            vehicle_make: res[0]?.rb_make_name,
            vehicle_model: res[0]?.rb_model_name,
            vehicle_variant: res[0]?.rb_variant_name,
            vehicle_fuel: this.fuelList[0],
          });
          this.cubicCapacitor = res[0]?.cubic_capacity;
        });
    }
  }

  /**
   *  this function use for get model listing
   */
  vehicleModel(model: any) {
    this.modelValueSelected = model?.value;
    this.vehicleDetailsForm.get('vehicle_variant')?.reset();
    this.vehicleDetailsForm.get('vehicle_fuel')?.reset();
    if (
      typeof this.modelValueSelected != 'object' &&
      this.modelValueSelected?.length >= 2
    ) {
      let apiData = `?product_name=${this.vehicleTypeValue}&make=${this.makeValueSelected}&model=${model.value}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
        .subscribe((res) => {
          if (res.message) {
            this.modelDataNotAvailable = true;
          } else {
            this.modelDataNotAvailable = false;
            this.modelList = res;
            this.variantDataNotAvailable = true;
          }
        });
    }
  }
  /**
   *  this function use for get variant listing
   */
  vehicleVariant(variant: any, variant_code: any) {
    this.vehicleDetailsForm.get('vehicle_fuel')?.reset();
    this.mmvBaseButtonDisable = true;
    if (
      typeof this.variantValueSelected != 'object' &&
      this.modelValueSelected != undefined
    ) {
      if (variant_code) {
        var apiData = `?product_name=${this.vehicleTypeValue}&make=${this.makeValueSelected}&model=${this.modelValueSelected}&variant=${variant}`;
      } else {
        this.variantValueSelected = variant.value;
        var apiData = `?product_name=${this.vehicleTypeValue}&make=${this.makeValueSelected}&model=${this.modelValueSelected}&variant=${variant.value}`;
      }
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_vehicle_mmv()}${apiData}`)
        .subscribe((res) => {
          if (res.message) {
            this.variantDataNotAvailable = true;
          } else {
            this.variantDataNotAvailable = false;
            this.fuelList = res;
            this.variantList = res;
            let variantName = this.variantList.find((item: any) => {
              if (item?.rb_variant_name == variant) {
                return item;
              }
            });

            if (variantName?.rb_variant_name == variant) {
              this.mmvBaseButtonDisable = false;
            }
          }
          if (this.fuelList?.length == 1) {
            this.vehicleDetailsForm.patchValue({
              vehicle_fuel: this.fuelList[0],
            });
          } else {
            if (this.fuelList) {
              let variantName = this.variantList.find((item: any) => {
                if (item?.rb_variant_name == variant) {
                  return item;
                }
              });

              if (variantName?.rb_variant_name == variant) {
                this.vehicleDetailsForm.patchValue({
                  vehicle_fuel: variantName,
                });
              }
            }
          }
        });
    }
  }
  varientSelected(option: any) {
    this.mmvBaseButtonDisable = false;
  }

  /**
   *  this function use for get variant listing
   */
  onCityInput(event: any): void {
    const inputValue = event?.target?.value || '';
    this.vehicleDetailsForm.get('registration_rto')?.setValue(null);
    this.vehicleDetailsForm.get('registration_rto')?.markAsUntouched();

    const rtoControl = this.vehicleDetailsForm.get('registration_rto');
    const cityControl = this.vehicleDetailsForm.get('registration_city');

    if (
      typeof inputValue === 'object' &&
      typeof this.vehicleDetailsForm.value.registration_city === 'object'
    ) {
      this.rtoInvalid = false;
      rtoControl?.setErrors(null);
      cityControl?.setErrors(null);
    } else {
      this.rtoInvalid = true;
      rtoControl?.setErrors({ cityRequired: true });
      rtoControl?.markAsTouched();
      cityControl?.setErrors({ rtoRequired: true });
      cityControl?.markAsTouched();
    }

    if (inputValue?.length >= 3) {
      const apiData = `?rto_code=${this.stateCode}&&rto_city=${inputValue}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_rto_list()}${apiData}`)
        .subscribe((res) => {
          if (!res?.message) {
            this.cityList = res.map((item: any) => ({
              ...item,
              display_name: item.display_name || item.rb_rto_code || 'No Name',
            }));
            this.rtoList = [...this.cityList];
            const value = this.cityList[0]?.rb_rto_code;
            this.stateCode = value.slice(0, 2);
          } else {
            this.cityList = [
              {
                rb_rto_code: '',
                rb_city_name: 'No Data',
                display_name: 'No Data',
              },
            ];
          }
        });
    }
  }

  vehcileRegistration(
    rto_code: any,
    rtoByRegistration?: any,
    registrationName?: any
  ) {
    rto_code =
      typeof rto_code === 'string'
        ? rto_code.replace(/[^a-zA-Z0-9 ]/g, '')
        : rto_code;

    this.rtoSelected = rto_code;
    this.rtoSelected = rto_code;
    if (typeof rto_code != 'object' && rto_code?.length >= 2) {
      let apiData = `?search_element=${rto_code}`;
      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_rto_list()}${apiData}`)
        .subscribe((res) => {
          if (!res?.message) {
            this.cityList = res.map((item: any) => ({
              ...item,
              display_name: item.display_name || item.rb_rto_code || 'No Name',
            }));
            this.rtoList = [...this.cityList];
            const value = this.cityList[0]?.rb_rto_code;
            this.stateCode = value.slice(0, 2);
            this.vehicleDetailsForm.patchValue({
              registration_rto: this.rtoList[0], // full object, not just rb_rto_code
            });

            if (rtoByRegistration) {
              this.vehicleDetailsForm.patchValue({
                registration_city: this.cityList[0],
              });
              setTimeout(() => {
                this.vehicleDetailsForm.patchValue({
                  registration_rto: this.rtoList[0],
                  registration_city: this.cityList[0],
                });
                this.rtoInvalid = false;
              }, 0);
            }
          }
        });
    }
    if (
      typeof this.vehicleDetailsForm.value.vehicle_fuel == 'object' &&
      typeof this.vehicleDetailsForm.value.registration_city == 'object'
    ) {
      this.mmvBaseButtonDisable = false;
    } else {
      this.mmvBaseButtonDisable = true;
    }
  }
  onRtoInput(event: any): void {
    const inputValue = event?.target?.value || '';
    this.vehicleDetailsForm.get('registration_city')?.reset();

    const cityControl = this.vehicleDetailsForm?.get('registration_city');
    const rtoControl = this.vehicleDetailsForm?.get('registration_rto');

    if (
      typeof inputValue === 'object' &&
      typeof this.vehicleDetailsForm.value.registration_city === 'object'
    ) {
      this.rtoInvalid = false;
      rtoControl?.setErrors(null);
      cityControl?.setErrors(null);
    } else {
      this.rtoInvalid = true;
      rtoControl?.setErrors({ cityRequired: true });
      rtoControl?.markAsTouched();
      cityControl?.setErrors({ rtoRequired: true });
      cityControl?.markAsTouched();
    }

    if (inputValue?.length >= 2) {
      const apiData = `?rto_code=${this.stateCode}&rto_code_number=${inputValue}`;

      this.apiservice
        .getRequestedResponse(`${ApiConstants.get_rto_list()}${apiData}`)
        .subscribe((res) => {
          if (!res?.message) {
            this.cityList = res.map((item: any) => ({
              ...item,
              display_name: item.display_name || item.rb_rto_code || 'No Name',
            }));
            this.rtoList = [...this.cityList];
          }
        });
    } else {
      this.rtoList = [
        {
          rb_rto_code: '',
          rb_city_name: 'No Data',
          display_name: 'No Data',
        },
      ];
    }
  }
  // Function to display the value in the input box
  displayRTOName(rto: any): string {
    // 🔍 Safety check: if rto is string or null, try to find the object in rtoList
    if (!rto || typeof rto !== 'object') {
      const match = this.rtoList?.find(
        (item: any) => item?.rb_rto_code?.slice(2) === rto
      );
      return match?.rb_rto_code?.slice(2) || '';
    }

    return rto?.rb_rto_code?.slice(2) || '';
  }

  displayCityName(city: any): any {
    if (city?.rb_city_name === 'No Data') {
      return '';
    } else {
      return city?.rb_city_name || '';
    }
  }

  getVehicleDetails(trace_id: any) {
    let apiUrl;
    apiUrl = `?trace_id=${trace_id}`;
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_trace_Id()}${apiUrl}`)
      .subscribe((res: any) => {
        if (res?.message != 'Partner not found') {
          this.vehcileModelDetails = res;
          sessionStorage.setItem('partnerCodeTraceId', JSON.stringify(res));
        } else if (res?.message == 'Partner not found') {
          this.openNotCertifiedPopup('');
        }
      });
  }
  // Call this when an RTO is selected from the dropdown
  onRtoSelected(event: MatOption) {
    const selectedValue = event.value;
    if (selectedValue?.rb_city_name === 'No Data') {
      this.rtoList = [];
      const cityControl = this.vehicleDetailsForm.get('registration_city');
      const rtoControl = this.vehicleDetailsForm.get('registration_rto');
      rtoControl?.setErrors({ cityRequired: true });
      rtoControl?.markAsTouched();
      cityControl?.setErrors({ rtoRequired: true });
      cityControl?.markAsTouched();
    } else {
      this.vehicleDetailsForm.patchValue({
        registration_city: selectedValue,
      });
      this.rtoInvalid = false;
    }
  }

  // Call this when a City is selected from the dropdown
  onCitySelected(event: MatOption) {
    const selectedValue = event.value;
    if (selectedValue?.rb_city_name === 'No Data') {
      this.cityList = [];
      const cityControl = this.vehicleDetailsForm.get('registration_city');
      const rtoControl = this.vehicleDetailsForm.get('registration_rto');
      rtoControl?.setErrors({ cityRequired: true });
      rtoControl?.markAsTouched();
      cityControl?.setErrors({ rtoRequired: true });
      cityControl?.markAsTouched();
    } else {
      this.vehicleDetailsForm.patchValue({
        registration_rto: selectedValue,
      });
      this.rtoInvalid = false;
    }
  }
  /*
   *
   * @param event - The change event for the Make dropdown
   */
  onOptionMakeSelected(event: any) {
    this.makeValueSelected = event.option.value;
  }
  /**
   * Handles the selection of a Model from the Model dropdown.
   *
   * @param event - The change event for the Model dropdown
   */
  onOptionModelSelected(event: any) {
    this.modelValueSelected = event.option.value;
  }
  /**
   * Handles the selection of a variant from the variant dropdown.
   *
   * @param event - The change event for the variant dropdown
   */
  onOptionVariantSelected(event: any) {
    this.variantValueSelected = event.option.value;
    this.showSelectedFuelandCapacity = true;
    this.fuelList = event.option.value;
  }

  // /**
  //  *
  //  * @param name displayMake used for display data
  //  * @returns
  //  */
  // displayMake(data?: any) {
  //   if (data != null && data != 'No result found' && this.vehicleMakeOninit) {
  //     return data ? data.rb_make_name : '';
  //   } else if (data == 'No result found') {
  //     return data;
  //   }
  // }

  // /**
  //  *
  //  * @param name displayModal used for display data
  //  * @returns
  //  */
  // displayModal(data?: any) {
  //   if (data != null && data != 'No result found' && this.vehicleModelOninit) {
  //     return data ? data.rb_model_name : '';
  //   } else if (data == 'No result found') {
  //     return data;
  //   }
  // }
  // /**
  //  *
  //  * @param name displayVariant used for display data
  //  * @returns
  //  */
  // displayVariant(data?: any) {
  //   if (
  //     data != null &&
  //     data != 'No result found' &&
  //     !this.vehicleVariantOnint
  //   ) {
  //     this.fuelArray = [];
  //     this.fuelArray.push(data);
  //     this.fuelList = this.fuelArray;
  //     return data ? data.rb_variant_name : '';
  //   } else if (data == 'No result found') {
  //     return data;
  //   }
  // }

  /**
   * This function is used to update the vehicle details
   * @param data
   */
  updateVehicleDetail(isValid: any) {
    if (isValid) {
      let title;
      if (this.editVehicleDetails) {
        title = 'Motor_details_verified';
        sessionStorage.removeItem('transaction_id');
      } else {
        title = 'Motor_details_Updated';
      }
      const token = sessionStorage.getItem('token');
      const transformedDateString = this.vehicleDetailsForm.value
        ?.registration_date
        ? this.datePipe.transform(
            this.vehicleDetailsForm.value?.registration_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';

      let regDate = transformedDateString
        ? new Date(transformedDateString as string)
        : '';

      const transformedMgfDate = this.vehicleDetailsForm.value?.manufacture_date
        ? this.datePipe.transform(
            this.vehicleDetailsForm.value?.manufacture_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';
      let mgfDate = transformedMgfDate
        ? new Date(transformedMgfDate as string)
        : '';

      const transformedPolicyExpiry = this.vehicleDetailsForm.value
        ?.policy_expiry_date
        ? this.datePipe.transform(
            this.vehicleDetailsForm.value?.policy_expiry_date,
            'yyyy-MM-ddTHH:mm:ss.SSSZ'
          )
        : '';
      let policyExpDate = transformedPolicyExpiry
        ? new Date(transformedPolicyExpiry as string)
        : '';

      if (this.vehicleDetailsForm.value?.policy_expiry) {
        for (let i = 0; i <= this.expiryList?.length - 1; i++) {
          if (
            this.expiryList[i]?.rb_expiring_policy_type_code ==
            this.vehicleDetailsForm.value?.policy_expiry
          ) {
            this.vehicleDetailsForm.value.type_of_exp_policy_id =
              this.expiryList[i]?.rb_expiring_policy_type_id;

            this.vehicleDetailsForm.patchValue({
              type_of_exp_policy_id:
                this.expiryList[i]?.rb_expiring_policy_type_id,
            });
          }
        }
      }
      const formData = {
        Motor_Type: this.vehicleTypeValue,
        Make: this.vehicleDetailsForm.value?.vehicle_variant?.rb_make_name,
        Model: this.vehicleDetailsForm.value?.vehicle_variant?.rb_model_name,
        Variant:
          this.vehicleDetailsForm.value?.vehicle_variant?.rb_variant_name,
        Fuel: this.vehicleDetailsForm.value?.vehicle_variant?.fuel,
        Registration_City:
          this.vehicleDetailsForm.value?.registration_city?.display_name,
        Registration_Date: regDate,
        Manufacture_Date: mgfDate,
        Used_Car_RC_Transfer: this.vehicleDetailsForm.value?.user_car
          ? 'Yes'
          : 'No',
        Type_of_Expiring_Policy: this.vehicleDetailsForm.value?.policy_expiry,
        Policy_Expiring_Date: policyExpDate,
        Search_previous_Insurer:
          this.vehicleDetailsForm.value?.previous_insurer?.rb_insurer_name,
        Is_previous_Policy_claimed: this.vehicleDetailsForm.value
          ?.previous_claimed
          ? 'Yes'
          : 'No',
        Previous_year_NCB: this.vehicleDetailsForm.value?.ncb_discount,
        User_Type: token != null ? 'Partner' : 'Customer',
        type_of_exp_policy_id:
          this.vehicleDetailsForm.value?.type_of_exp_policy_id,
      };
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (value == null || value === '') {
            return false;
          }
          if (
            formData.Type_of_Expiring_Policy === 'IDK' &&
            (key === 'Search_previous_Insurer' ||
              key === 'Previous_year_NCB' ||
              key === 'Is_previous_Policy_claimed')
          ) {
            return false;
          }
          return true;
        })
      );

      webengage.track(title, filteredData);
      // this.sharedDataService.sendCarLoaderMessage(0);
      this.renderer.removeClass(document.body, 'dropdown-focus');
      if (window.innerWidth <= 999) {
        this.bottomSheetRef.dismiss();
      } else {
        this.dialogRef.close();
      }

      sessionStorage.setItem('vehiclePopup', 'true');
      // if (this.vehicleMMVValue) {
      //   sessionStorage.removeItem('vehicleMMVData');
      // }
      let idvData = sessionStorage.getItem('idvData');
      if (idvData) {
        sessionStorage.removeItem('idvData');
      }
      this.vehicleDetailsForm.get('ncb_discount')?.enable();

      let vehicleFrom: any;

      vehicleFrom = JSON.stringify(this.vehicleDetailsForm.value);
      if (this.isNewVehicle) {
        this.bussiness_type = 'new';
      } else {
        this.bussiness_type = 'renewal';
      }
      let initiate_quotes_payload = {
        form_value: this.vehicleDetailsForm.value,
        vehcile_mmv: this.vehicleDetailsForm.value?.vehicle_fuel,
        bussiness_type: this.bussiness_type,
      };

      this.updateVehicleDetailsPOpUpdata(
        this.vehicleDetailsForm.value,
        this.trace_id
      );
      sessionStorage.setItem(
        'mmv_data',
        JSON.stringify(initiate_quotes_payload)
      );
      sessionStorage.setItem('newVehicleType', this.bussiness_type);

      sessionStorage.removeItem('allNCBDataProposal');
      sessionStorage.removeItem('proposal_Id');
      this.sharedDataService.vehicleCardData(vehicleFrom);
      // this.sharedDataService.initiate_Quotes_APi(initiate_quotes_payload)
      webengage.track('Motor_Type', {
        Option_Selected: this.vehicleTypeValue,
        User_Type: sessionStorage.getItem('partner_code')
          ? sessionStorage.getItem('partner_code')
          : null,
        Motor_Type: this.vehicleTypeValue,
      });
    } else {
      this.showErrorMessage = false;
    }
  }

  /**
   *
   * @param name onRCTransferChange used for validation change in the form data
   * @returns
   */
  onRCTransferChange(event: any) {
    this.getExpiringPolicy(false);
    this.vehicleDetailsForm.patchValue({
      policy_expiry: '',
    });
  }

  /**
   *
   * @param name onExpiryPolicyChange used for expiring policy
   * @returns
   */
  onExpiryPolicyChange(value: any): void {
    this.showErrorMessage = false;
    this.ExpiryPolicyType = value;
    if (value == 'IDK') {
      this.iDKSelected = true;
      this.vehicleDetailsForm.get('policy_expiry_date')?.clearValidators();
      this.vehicleDetailsForm.get('previous_insurer')?.clearValidators();
      this.vehicleDetailsForm.get('previous_claimed')?.clearValidators();
      this.vehicleDetailsForm.get('previous_claimed')?.setValue(false);
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.reset();
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_insurer')?.reset();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    } else if (value == 'bundled_tp' || value == 'satp') {
      this.iDKSelected = false;
      this.hidePreviousClaimed = true;
      this.vehicleDetailsForm.get('previous_claimed')?.clearValidators();
      this.vehicleDetailsForm.get('previous_claimed')?.setValue(false);
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
    } else if (value != '') {
      this.getNcbList();
      this.iDKSelected = false;
      this.hidePreviousClaimed = false;
      if (!this.vehicleDetailsForm.value?.policy_expiry_date) {
        this.showExpiryDateErrorMessage = true;
      }
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('previous_claimed')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('ncb_discount')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    }
    for (let i = 0; i <= this.expiryList?.length - 1; i++) {
      if (this.expiryList[i]?.rb_expiring_policy_type_code == value) {
        this.vehicleDetailsForm.value.type_of_exp_policy_id =
          this.expiryList[i]?.rb_expiring_policy_type_id;

        this.vehicleDetailsForm.patchValue({
          type_of_exp_policy_id: this.expiryList[i]?.rb_expiring_policy_type_id,
        });
      }
    }
  }

  /**
   * Handles the key press event for the previous insurer input field.
   *
   * @param event - The key press event
   */
  handlePreviousInsurerKeyPress(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  patchPreviousInsurer() {
    this.sharedDataService.renewalInsurer.subscribe((renewalInsurer: any) => {
      if (renewalInsurer != 'No result found') {
        this.vehicleDetailsForm.patchValue({
          previous_insurer: renewalInsurer,
        });
        sessionStorage.setItem(
          'renewalPreviousInsurer',
          JSON.stringify(renewalInsurer)
        );
      }
    });
  }
  claimedPolicy(data: any, allData?: any) {}

  getExpiringPolicy(regDateChange?: any) {
    this.regDateObj = this.vehicleDetailsForm.get('registration_date')?.value
      ? this.datePipe.transform(
          this.vehicleDetailsForm.get('registration_date')?.value,
          'MM/YYYY'
        )
      : '';
    let expiry_date = this.vehicleDetailsForm.get('policy_expiry_date')?.value
      ? this.datePipe.transform(
          this.vehicleDetailsForm.get('policy_expiry_date')?.value,
          'dd/MM/YYYY'
        )
      : '';
    let userRCtransfer = this.vehicleDetailsForm.value.user_car
      ? this.vehicleDetailsForm.value.user_car
      : false;
    let previousClaimed = this.vehicleDetailsForm.value.previous_claimed
      ? this.vehicleDetailsForm.value.previous_claimed
      : false;
    let expiringPolicyType = `?registration_date=${this.regDateObj}&vehicle_type=${this.vehicleTypeValue}&previous_policy_expiry_date=${expiry_date}&is_claimed=${previousClaimed}&is_ownership_transfer=${userRCtransfer}`;
    if (
      this.regDateObj != null &&
      this.regDateObj != '' &&
      expiry_date != null &&
      expiry_date != '' &&
      !regDateChange
    ) {
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.getExpiringPolicy()}${expiringPolicyType}`
        )
        ?.subscribe((res) => {
          if (res) {
            this.isNewVehicle = res?.is_new_vehicle;
            this.expiryList = res.expiring_policy_type;
            const isRbRenewal = sessionStorage.getItem('isRbRenewal');
            if (this.vehcileFormData?.dialog_type == 'edit') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (
                  this.expiryList[i]?.rb_expiring_policy_type_id ==
                  this.vehicleDetailsForm.value?.type_of_exp_policy_id
                ) {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  if (
                    this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK'
                  ) {
                    this.iDKSelected = true;
                  }
                }
              }
            } else if (isRbRenewal == 'true') {
              this.vehicleDetailsForm.patchValue({
                policy_expiry: this.coverageType.coverage_type_code,
              });
            }
            if (this.traceIdAllData?.policy_expiry_date == 'Not Sure') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK') {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  this.iDKSelected = true;
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.updateValueAndValidity();
                }
              }
            }
            if (
              !(
                this.ExpiryPolicyType == 'bundled_tp' ||
                this.ExpiryPolicyType == 'satp'
              )
            ) {
              this.ncbDiscount = this.expiryList[0]?.offered_ncb_value;
              this.getNcbList();
            }
          }
        });
    } else if (
      regDateChange &&
      this.regDateObj != null &&
      this.regDateObj != '' &&
      expiry_date != null &&
      expiry_date != ''
    ) {
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.getExpiringPolicy()}${expiringPolicyType}`
        )
        ?.subscribe((res) => {
          if (res) {
            this.isNewVehicle = res?.is_new_vehicle;
            this.expiryList = res.expiring_policy_type;
            const isRbRenewal = sessionStorage.getItem('isRbRenewal');
            if (this.vehcileFormData?.dialog_type == 'edit') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (
                  this.expiryList[i]?.rb_expiring_policy_type_id ==
                  this.vehicleDetailsForm.value?.type_of_exp_policy_id
                ) {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                }
              }
            } else if (isRbRenewal == 'true') {
              this.vehicleDetailsForm.patchValue({
                policy_expiry: this.coverageType.coverage_type_code,
              });
            }
            this.getNcbList();
          }
        });
    } else if (
      this.traceIdAllData?.policy_expiry_date == 'Not Sure' ||
      this.vehcileFormData?.value?.policy_expiry == 'IDK'
    ) {
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.getExpiringPolicy()}${expiringPolicyType}`
        )
        ?.subscribe((res) => {
          if (res) {
            this.isNewVehicle = res?.is_new_vehicle;
            this.expiryList = res.expiring_policy_type;
            const isRbRenewal = sessionStorage.getItem('isRbRenewal');
            if (this.vehcileFormData?.dialog_type == 'edit') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (
                  this.expiryList[i]?.rb_expiring_policy_type_id ==
                  this.vehicleDetailsForm.value?.type_of_exp_policy_id
                ) {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  if (
                    this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK'
                  ) {
                    this.iDKSelected = true;
                  }
                }
              }
            } else if (isRbRenewal == 'true') {
              this.vehicleDetailsForm.patchValue({
                policy_expiry: this.coverageType.coverage_type_code,
              });
            }
            if (
              this.traceIdAllData?.policy_expiry_date == 'Not Sure' ||
              this.vehcileFormData?.value?.policy_expiry == 'IDK'
            ) {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK') {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  this.iDKSelected = true;
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.updateValueAndValidity();
                }
              }
            }
          }
        });
    }
    if (
      this.policyExpiryDate != null &&
      expiry_date == '' &&
      this.regDateObj != null &&
      this.regDateObj != ''
    ) {
      let expiringPolicyType = `?registration_date=${this.regDateObj}&vehicle_type=${this.vehicleTypeValue}&previous_policy_expiry_date=${this.policyExpiryDate}&is_claimed=${previousClaimed}&is_ownership_transfer=${userRCtransfer}`;

      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.getExpiringPolicy()}${expiringPolicyType}`
        )
        ?.subscribe((res) => {
          if (res) {
            this.isNewVehicle = res?.is_new_vehicle;
            this.expiryList = res.expiring_policy_type;
            const isRbRenewal = sessionStorage.getItem('isRbRenewal');
            if (this.vehcileFormData?.dialog_type == 'edit') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (
                  this.expiryList[i]?.rb_expiring_policy_type_id ==
                  this.vehicleDetailsForm.value?.type_of_exp_policy_id
                ) {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  if (
                    this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK'
                  ) {
                    this.iDKSelected = true;
                  }
                }
              }
            } else if (isRbRenewal == 'true') {
              this.vehicleDetailsForm.patchValue({
                policy_expiry: this.coverageType.coverage_type_code,
              });
            }
            if (this.traceIdAllData?.policy_expiry_date == 'Not Sure') {
              for (let i = 0; i <= this.expiryList?.length - 1; i++) {
                if (this.expiryList[i]?.rb_expiring_policy_type_code == 'IDK') {
                  this.showErrorMessage = false;
                  this.vehicleDetailsForm.patchValue({
                    policy_expiry:
                      this.expiryList[i]?.rb_expiring_policy_type_code,
                  });
                  this.iDKSelected = true;
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.clearValidators();
                  this.vehicleDetailsForm
                    .get('ncb_discount')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_claimed')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('previous_insurer')
                    ?.updateValueAndValidity();
                  this.vehicleDetailsForm
                    .get('policy_expiry_date')
                    ?.updateValueAndValidity();
                }
              }
            }
            if (
              !(
                this.ExpiryPolicyType == 'bundled_tp' ||
                this.ExpiryPolicyType == 'satp'
              )
            ) {
              this.ncbDiscount = this.expiryList[0]?.offered_ncb_value;
              this.getNcbList();
            }
          }
        });
    }
  }
  getNcbList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.ncb_list())
      .subscribe((res) => {
        this.ncbListData = res;
        const incomingNCB = this.vehcileFormData?.value?.ncb_discount;
        if (incomingNCB != undefined && !this.is_renewal) {
          let getNcbValue =
            incomingNCB.old_ncb_value == undefined
              ? incomingNCB
              : incomingNCB.old_ncb_value;
          const matchedNCB = this.ncbListData.find(
            (item: any) => item.old_ncb_value === getNcbValue
          );

          if (matchedNCB) {
            this.vehicleDetailsForm.patchValue({
              ncb_discount: matchedNCB,
            });
          }

          this.ncbDiscount = matchedNCB;
        } else if (this.is_renewal) {
          const matchedNCB = this.ncbListData.find(
            (item: any) =>
              item.old_ncb_value ===
              this.renewalVehicleDetails?.previous_year_ncb
          );
          if (matchedNCB) {
            this.vehicleDetailsForm.patchValue({
              ncb_discount: matchedNCB,
            });
            this.ncbDiscount = matchedNCB;
          }
        } else {
          for (let data of this.expiryList) {
            const matchedNCB = this.ncbListData.find(
              (item: any) => item.old_ncb_value === data.offered_ncb_value
            );

            if (matchedNCB) {
              this.vehicleDetailsForm.patchValue({
                ncb_discount: matchedNCB,
              });
              this.ncbDiscount = matchedNCB;
              break;
            }
          }
        }
        if (this.vehicleDetailsForm.value.policy_expiry == 'satp') {
          this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
        }
        this.mmvBaseButtonDisable = false;
      });
  }

  updateVehicleDetailsPOpUpdata(value: any, trace_id: any) {
    let apiUrl;

    apiUrl = `${trace_id}`;
    const data = {
      quotes_data: value,
    };
    this.apiservice
      .patchRequestedResponse(
        `${ApiConstants.update_trace_id_data}${apiUrl}/`,
        data
      )
      .subscribe((res: any) => {
        this.sharedDataService.vehicleCardTypeData(
          JSON.stringify(res.quote_data?.quotes_data)
        );
        this.sharedDataService.getTraceIdDetails(res);
      });
  }

  formatDDMMYYYYToDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const day = +parts[0];
    const month = +parts[1] - 1; // JavaScript months are 0-based
    const year = +parts[2];

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
  formatToYearMonth(dateStr: string): string | null {
    if (!dateStr) return null;

    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const year = parts[2];
    const month = parts[1].padStart(2, '0'); // ensure two-digit month

    return `${year}-${month}`;
  }

  onRegistrationDateChange(journeyType: any) {
    if (!this.editVehicleDetails && this.journeyType == 'registrationNumber') {
      this.vehicleDetailsForm.get('manufacture_date')?.reset();
    }
    if (journeyType == 'rollover') {
      this.isNewVehicle = false;
      this.vehicleDetailsForm
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      if (
        this.vehcileFormData?.value?.policy_expiry != 'satp' &&
        this.vehcileFormData?.value?.policy_expiry != 'bundled_tp' &&
        this.vehcileFormData?.value?.policy_expiry != 'IDK'
      ) {
        this.vehicleDetailsForm
          .get('ncb_discount')
          ?.setValidators([Validators.required]);
        this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      }
    } else {
      this.isNewVehicle = true;
      this.vehicleDetailsForm.get('previous_insurer')?.clearValidators();
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('policy_expiry_date')?.clearValidators();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.vehicleDetailsForm.get('policy_expiry')?.clearValidators();
      this.vehicleDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
    }
  }

  backspacePressedOnce = false;

  onKeyDown(event: KeyboardEvent) {
    const control = this.vehicleDetailsForm.get('registration_city');
    const value = control?.value;

    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      value &&
      typeof value === 'object'
    ) {
      control?.reset();
      event.preventDefault();
    }
  }
  convertToFirstDayOfMonth(dateStr: string): Date | null {
    if (dateStr && /^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, 1); // JS months are 0-indexed
    }
    return null;
  }
  onChangeCIty() {
    this.vehicleDetailsForm
      .get('registration_city')
      ?.valueChanges?.pipe(take(1))
      .subscribe((value) => {
        this.vehicleDetailsForm?.get('registration_rto')?.reset();
        const rtoControl = this.vehicleDetailsForm?.get('registration_rto');
        const cityControl = this.vehicleDetailsForm?.get('registration_city');

        if (value !== null && typeof value === 'object' && rtoControl?.value) {
          this.rtoInvalid = false;
          if (rtoControl?.hasError('cityRequired')) {
            rtoControl.setErrors(null);
            rtoControl.updateValueAndValidity();
          }
        } else {
          // if (rtoControl) {
          this.rtoInvalid = true;
          rtoControl?.setErrors({ cityRequired: true });
          rtoControl?.markAsTouched();
          cityControl?.setErrors({ rtoRequired: true });
          cityControl?.markAsTouched();
          // }
        }
      });
  }

  openNotCertifiedPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }

    const obj: any = {
      modalName: this.notCertifiedComponentJSON['modalName'],
      width: this.notCertifiedComponentJSON['widthObtained'],
      height: this.notCertifiedComponentJSON['heightObtained'],
      classNameObtained: this.notCertifiedComponentJSON['classObtained'],
      isOutSideClose: this.notCertifiedComponentJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.renewalPopup.unsubscribe();
  }
}
