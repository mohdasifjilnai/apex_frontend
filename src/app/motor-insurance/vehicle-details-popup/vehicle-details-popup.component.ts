import {
  Component,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, RouterState } from '@angular/router';
import moment from 'moment';
import {
  Observable,
  catchError,
  debounceTime,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-vehicle-details-popup',
  templateUrl: './vehicle-details-popup.component.html',
  styleUrls: ['./vehicle-details-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VehicleDetailsPopupComponent implements OnInit {
  vehicleDetailsForm!: FormGroup;
  @Input('required') isRequired = false;
  modelList: any;
  variantList: any;
  fuelList: any;
  cityList: any;
  rcList: any;
  expiryList: any;
  claimedList: any;
  ncbList: any;
  editVehicleDetails: boolean = true;
  vehcileType: any;
  mmvList: any;
  rtoList: any;
  fuelData: any;
  mmDataNotAvailable = '';
  mmId: any;
  modelDataNotAvailable = '';
  variantDataNotAvailable = '';
  variantId: any;
  rtoDataNotAvailable = '';
  rtoId: any;
  ncbDiscountData = true;
  vehicleMMVValue: any;
  vehicleMMVData: any;
  convertExpiryDate: any;
  mmvData: any = [];
  expiringPolicy: any;
  regNumber: any;
  registrationMonth: any;
  registrationYear: any;
  regDateObj: any;
  expiring_policy_type: any;
  ncbDiscount: any;
  manufactureDate: any;
  isNewVehicle: boolean = true;
  newVehicleData: any;
  policyExpiredDateObject: any;
  ncbAllData: any;
  claimedField = true;
  patchData = false;
  isCheckWheeler: boolean = true;
  vaahanName: any;
  checkWheeler: any;
  vehicleAllData: any;
  isNewVehicleUpdate = true;
  vehiclePopupListEmail: any;
  vehicleMakeOninit = true;
  vehicleModelOninit = true;
  vehicleVariantOnint = true;
  vehicleRegistrationCityOninit = true;
  makeValueSelected: any;
  modelValueSelected: any;
  variantValueSelected: any;
  fuelArray: any;
  mmvBaseButtonDisable = false;
  vehiclePreviousInsurerOninit = true;
  url = 'quotes';
  renewalType: any;
  /**
   * MMV is use for (Make Model Variant)
   * filteredMMV used for the filter MMV data
   */
  filteredPopupMMV!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  filteredPopupVariant!: any;
  filteredPopupMake!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteVariant!: MatAutocompleteTrigger;

  vehicleTypeValue: any;

  filteredRtoList!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteRTO!: MatAutocompleteTrigger;

  registrationNumberValue: any;
  expiryListData: any;
  expiryPolicyList: any;
  vehiclePopupList: any;
  rto_id: any;
  NoExpiryPolicy: boolean = false;
  hidePreviousClaimed: boolean = true;
  editClick = '';
  makeList: any;
  filteredPopupModel!: any;
  makeSelected: any;
  modelSelected: any;
  editVehiclePatch = true;
  showSelectedFuelandCapacity: any = false;
  cubicCapacitor: any;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private FormBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private apiservice: ApiService,
    public bottomSheetRef: MatBottomSheetRef<VehicleDetailsPopupComponent>,
    private renderer: Renderer2,
    public router: Router
  ) {
    this.vehicleDetailsFormControler();
    // this.getClaimedList();
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

    this.sharedDataService.getVehicleDetails.subscribe((res) => {
      if (res === 'edit' && this.editVehiclePatch) {
        this.editVehicleDetails = false;
        this.editClick = res;
        this.vehiclePopupList = sessionStorage.getItem('mmv_data');
        let vehicleCard = JSON.parse(this.vehiclePopupList);
        this.vehicleAllData = vehicleCard;
        if (vehicleCard) {
          this.patchVehicleData(vehicleCard);
        }
        if (this.vehicleAllData) {
          this.rto_id = this.vehicleAllData?.registration_city?.rb_rto_id;

          this.getRTOData('rto_code');
          this.vehicleDetailsForm.patchValue({
            registration_city: this.vehicleAllData?.registration_city,
          });
          this.getVehicleDetailsPopup(
            '',
            '',
            '',
            this.vehicleAllData?.vehicle_variant.rb_mmv_id,
            'mmvData'
          );
        }
      }
    });
  }

  withRegistrationNumber: any;
  changeRegNumber: any;
  registrationNumber: any;
  dataWithoutRegistration: any;
  ngOnInit(): void {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.showSelectedFuelandCapacity = false;
    const expiryPolicy = this.vehicleDetailsForm.get('policy_expiry')?.value;
    if (expiryPolicy === 'bundled_tp') {
      this.hideFieldOnExpiryPolicy('bundled_tp');
    }

    this.sharedDataService.getValueWithoutRegistration.subscribe((res) => {
      this.dataWithoutRegistration = res;
    });

    this.regNumber = sessionStorage.getItem('registrationNumber');
    if (this.regNumber) {
      this.sharedDataService.vehicleDetails('registrationNumber');
    }
    if (!this.vehicleDetailsForm.get('user_car')?.value) {
      if (!this.vehicleDetailsForm.get('previous_claimed')?.value)
        this.vehicleDetailsForm.patchValue({
          user_car: false,
          previous_claimed: false,
        });
    }

    this.sharedDataService.getRegistrationData.subscribe((res) => {
      let regDateValue = new Date(res);
      if (this.editClick == '') {
        this.getExpiringPolicy(regDateValue);
      } else {
        this.expiryPolicyGetList(regDateValue, 'dateChange');
      }
    });
    this.checkWheelerType(this.editVehicleDetails);

    // ONInit Function Call

    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    this.sharedDataService.regNumberData.subscribe((numberData) => {
      this.registrationNumber = numberData;
      if (this.registrationNumber?.rb_mmv_id && this.isCheckWheeler) {
        this.getVehicleDetailsPopup(
          '',
          '',
          '',
          this.registrationNumber.rb_mmv_id,
          ''
        );
        this.getRTOData('rto_code');
      }
    });

    this.sharedDataService.regNumberDataRenewal.subscribe(
      (renewalregistartionnumber: any) => {
        this.registrationNumber = renewalregistartionnumber;
        if (this.registrationNumber?.rb_mmv_id) {
          this.getVehicleDetailsPopup(
            '',
            '',
            '',
            this.registrationNumber.rb_mmv_id,
            ''
          );
          this.getRTOData('');
        }
      }
    );

    this.sharedDataService.renewalInsurer.subscribe((renewalInsurer: any) => {
      this.vehicleDetailsForm.patchValue({
        previous_insurer: renewalInsurer,
      });
    });

    this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
    this.rto_id = this.vehicleMMVValue?.rto_city?.rb_rto_id;
    if (this.vehicleMMVValue) {
      this.getExpiringPolicy();

      this.getRTOData('rto_code');

      this.getVehicleDetailsPopup(
        '',
        '',
        '',
        this.vehicleMMVValue?.vehicle.rb_mmv_id,
        'mmvData'
      );
    }

    this.getNcbList();
    this.getPolicyExpiryList();
    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType == 'renewal') {
      this.vehicleDetailsForm.get('vehicle_make')?.disable();
      this.vehicleDetailsForm.get('vehicle_model')?.disable();
      this.vehicleDetailsForm.get('vehicle_variant')?.disable();
      this.vehicleDetailsForm.get('vehicle_fuel')?.disable();
      this.vehicleDetailsForm.get('registration_city')?.disable();
      this.vehicleDetailsForm.get('ncb_discount')?.disable();
      this.vehicleDetailsForm.get('policy_expiry')?.disable();
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
      user_car: [''],
      policy_expiry_date: [''],
      policy_expiry: [''],
      previous_claimed: [''],
      ncb_discount: [''],
      manufacture_date: [moment(), Validators.required],
      registration_date: ['', Validators.required],
      previous_insurer: [''],
      vehicle_MMV: [''],
    });
  }
  /**
   * Get the MMV popup data
   */
  checkWheelerType(editVehicleDetails: boolean) {
    this.checkWheeler = JSON.parse(
      sessionStorage.getItem('checkWheeler') || '{}'
    );
    if (editVehicleDetails && Object.keys(this.checkWheeler).length > 0) {
      if (
        (localStorage.getItem('vehicleType') == 'private_car' &&
          this.checkWheeler['is_four_wheeler']) ||
        (localStorage.getItem('vehicleType') == 'two_wheeler' &&
          this.checkWheeler['is_two_wheeler'])
      ) {
        this.isCheckWheeler = true;
      } else {
        if (this.checkWheeler['is_two_wheeler']) {
          this.vaahanName = 'bike';
        }
        if (this.checkWheeler['is_four_wheeler']) {
          this.vaahanName = 'car';
        }
        this.isCheckWheeler = false;
      }
    }
  }

  /**
   * This function is used to patch the vehicle details
   * @param data
   */

  patchVehicleData(data: any) {
    let registrationDateObject;
    let registrationDate;
    let manufactureDateObject;
    let previousInsurerObject;
    this.patchData = true;
    this.editVehiclePatch = false;
    this.hidePreviousClaimed = data?.hidePreviousClaimed;
    this.NoExpiryPolicy = data?.NoExpiryPolicy;
    if (data?.registration_date) {
      registrationDate = new Date(data?.registration_date);
      registrationDateObject = moment(registrationDate, 'MM/YYYY');
    }
    if (data?.manufacture_date) {
      let manufactureDate = new Date(data?.manufacture_date);
      manufactureDateObject = moment(manufactureDate, 'MM/YYYY');
    }
    if (data?.policy_expiry_date) {
      let policyExpiredDate = new Date(data?.policy_expiry_date);
      this.policyExpiredDateObject =
        moment(policyExpiredDate).format('MM/DD/YYYY');
    }
    this.showSelectedFuelandCapacity = true;
    this.cubicCapacitor = data?.vehicle_variant?.cubic_capacity;

    this.vehicleDetailsForm.patchValue({
      vehicle_make: data.vehicle_make,
      vehicle_model: data.vehicle_model,
      vehicle_variant: data.vehicle_variant,
      registration_city: data.registration_city,
      vehicle_fuel: data.vehicle_fuel,
      registration_date: registrationDate,
      manufacture_date: manufactureDateObject,
      user_car: data.user_car,
      previous_claimed: data.previous_claimed,
      previous_insurer: data?.previous_insurer,
      ncb_discount: data?.ncb_discount,
      policy_expiry: data?.policy_expiry,
      policy_expiry_date: new Date(this.policyExpiredDateObject),
    });
    this.renderer.addClass(document.body, 'dropdown-focus');
    this.makeValueSelected = data.vehicle_make;
    this.modelValueSelected = data.vehicle_model;
    this.variantValueSelected = data.vehicle_variant;
    this.isNewVehicle = data?.isNewVehicleUpdate;
    this.onRCTransferChange(data.user_car);
    this.claimedPolicy(data.previous_claimed);
    this.expiryPolicyGetList(registrationDateObject, '');
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
   * This function is used to update the vehicle details
   * @param data
   */
  updateVehicleDetail() {
    this.sharedDataService.sendCarLoaderMessage(0);
    this.renderer.removeClass(document.body, 'dropdown-focus');
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }

    sessionStorage.setItem('vehiclePopup', 'true');
    if (this.vehicleMMVValue) {
      sessionStorage.removeItem('vehicleMMVData');
    }

    this.vehicleDetailsForm.value.NoExpiryPolicy = this.NoExpiryPolicy;
    this.vehicleDetailsForm.value.hidePreviousClaimed =
      this.hidePreviousClaimed;

    if (
      this.vehicleDetailsForm.value?.policy_expiry != 'IDK' &&
      this.vehicleDetailsForm.value?.policy_expiry != '' &&
      this.vehicleDetailsForm.value?.policy_expiry != 'satp' &&
      this.vehicleDetailsForm.value?.policy_expiry != 'bundled_tp' &&
      !this.isNewVehicle
    ) {
      if (
        this.vehicleDetailsForm.value?.ncb_discount ||
        this.vehicleDetailsForm.value?.ncb_discount == 0
      ) {
        for (let i = 0; i <= this.expiryListData.length - 1; i++) {
          if (
            this.expiryListData[i].old_ncb_value ==
            this.vehicleDetailsForm.value.ncb_discount
          ) {
            this.ncbAllData = this.expiryListData[i];
          }
        }
        this.vehicleDetailsForm.value.addNcbBoth = this.ncbAllData;
      }
    } else {
      this.vehicleDetailsForm.value.ncb_discount = 0;
    }

    if (this.vehicleDetailsForm.value?.policy_expiry) {
      for (let i = 0; i <= this.expiryList.length - 1; i++) {
        if (
          this.expiryList[i]?.rb_expiring_policy_type_code ==
          this.vehicleDetailsForm.value?.policy_expiry
        ) {
          this.vehicleDetailsForm.value.policy_expiry_id_data =
            this.expiryList[i]?.rb_expiring_policy_type_id;
        }
      }
    }
    let vehicleFrom;
    if (this.renewalType != 'renewal') {
      this.vehicleDetailsForm.value.isNewVehicleUpdate = this.isNewVehicle;

      vehicleFrom = JSON.stringify(this.vehicleDetailsForm.value);

      sessionStorage.setItem('mmv_data', vehicleFrom);
    } else {
      let vehicleMMVFrom = JSON.parse(
        sessionStorage.getItem('mmv_data') || '{}'
      );
      let mmvFromValue = {
        previous_insurer: vehicleMMVFrom.previous_insurer,
        registration_city: vehicleMMVFrom.registration_city,
        registration_date: vehicleMMVFrom.registration_date,
        vehicle_fuel: vehicleMMVFrom.vehicle_fuel,
        vehicle_make: vehicleMMVFrom.vehicle_make,
        vehicle_model: vehicleMMVFrom.vehicle_model,
        vehicle_variant: vehicleMMVFrom.vehicle_variant,
        policy_expiry_date: vehicleMMVFrom.policy_expiry_date,
        policy_expiry: vehicleMMVFrom.policy_expiry,
        manufacture_date: vehicleMMVFrom.manufacture_date,
        isNewVehicleUpdate: vehicleMMVFrom.isNewVehicleUpdate,
        hidePreviousClaimed: vehicleMMVFrom.hidePreviousClaimed,
        user_car: this.vehicleDetailsForm.value.user_car,
        previous_claimed: this.vehicleDetailsForm.value.previous_claimed,
        ncb_discount: 0,

        renewalNCBDiscount: '',
        addNcbBoth: '',
      };
      if (
        !this.vehicleDetailsForm.value.previous_claimed &&
        vehicleMMVFrom.renewalNCBDiscount
      ) {
        mmvFromValue.ncb_discount = vehicleMMVFrom.renewalNCBDiscount;
        mmvFromValue.renewalNCBDiscount = vehicleMMVFrom.renewalNCBDiscount;
      } else {
        mmvFromValue.ncb_discount = !this.vehicleDetailsForm.value
          .previous_claimed
          ? vehicleMMVFrom.ncb_discount
          : 0;
        mmvFromValue.renewalNCBDiscount = vehicleMMVFrom.renewalNCBDiscount
          ? vehicleMMVFrom.renewalNCBDiscount
          : vehicleMMVFrom.ncb_discount;
      }
      if (mmvFromValue.ncb_discount || mmvFromValue.ncb_discount == 0) {
        for (let i = 0; i <= this.expiryListData.length - 1; i++) {
          if (
            this.expiryListData[i].old_ncb_value == mmvFromValue.ncb_discount
          ) {
            this.ncbAllData = this.expiryListData[i];
          }
        }
        mmvFromValue.addNcbBoth = this.ncbAllData;
      }
      vehicleFrom = JSON.stringify(mmvFromValue);

      sessionStorage.setItem('mmv_data', vehicleFrom);
    }

    this.sharedDataService.vehicleCardData(vehicleFrom);
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterMMVPopup(name: string) {
    if (typeof name != 'object') {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&search_element=${name}`
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res) && res.length > 0) {
              this.modelList = res.map((item) => ({
                ...item,
                displayMM: `${item.rb_make_name} | ${item.rb_model_name}`,
              }));
              this.variantList = res;
              this.fuelList = res;

              this.mmDataNotAvailable = '';
              this.fuelData = Object.values(
                this.fuelList.reduce(
                  (data: any, obj: { fuel: any; id: any }) => ({
                    ...data,
                    [obj.fuel]: obj,
                  }),
                  {}
                )
              );
              this.filteredPopupMMV = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterMMVPopup(name) : this.modelList;
                })
              );

              this.mmDataNotAvailable = '';
            } else {
              this.mmDataNotAvailable = 'No data';
              this.filteredPopupMMV = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterMMVPopup(name) : ['No data'];
                })
              );
            }
          },
          (error) => {
            console.error('API Request Error:', error);
          }
        );
    }
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  // filterVariantPopup(name: string) {
  //   // this.apiservice
  //   //   .getRequestedResponse(
  //   //     `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&search_element=${name}`
  //   //   )
  //   //   .subscribe(
  //   //     (res) => {
  //   //       if (Array.isArray(res) && res.length > 0) {
  //   // this.variantList = res;

  //   if (this.variantList) {
  //     this.filteredPopupVariant = this.vehicleDetailsForm.controls[
  //       'vehicle_variant'
  //     ].valueChanges.pipe(
  //       debounceTime(500),
  //       startWith(''),
  //       map((value) => {
  //         return value ? this.filterVariantPopup(value) : this.variantList;
  //       })
  //     );

  //     this.variantDataNotAvailable = '';
  //   } else {
  //     this.variantDataNotAvailable = 'No data';
  //     this.filteredPopupVariant = this.vehicleDetailsForm.controls[
  //       'vehicle_variant'
  //     ].valueChanges.pipe(
  //       debounceTime(500),
  //       startWith(''),
  //       map((value) => {
  //         return value ? this.filterVariantPopup(value) : ['No data'];
  //       })
  //     );
  //   }
  //   // },
  //   // (error) => {
  //   //   console.error('API Request Error:', error);
  //   // }
  //   // );
  // }
  /**
   *
   * @param name getRTOData used for filter RTO data
   * @returns
   */
  getRTOData(type?: any) {
    let apiData;
    if (this.rto_id) {
      apiData = `?rb_rto_id=${this.rto_id}`;
    } else {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      apiData =
        type == 'rto_code'
          ? `?search_element=${this.registrationNumber?.rb_rto_code}`
          : '';
    }
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_rto_list}${apiData}`)
      .subscribe((res) => {
        if (res && res.length > 0 && !res.message) {
          this.rtoList = res;
          this.rtoDataNotAvailable = '';

          this.filteredRtoList = this.vehicleDetailsForm.controls[
            'registration_city'
          ].valueChanges.pipe(
            debounceTime(500),
            startWith(''),
            switchMap((name) => this.filterRTO(name)),
            catchError((error) => {
              this.rtoDataNotAvailable = 'Error fetching data';
              return of(['No data']);
            })
          );
          if (type != 'blank') {
            if (this.registrationNumber) {
              for (let i = 0; i <= this.rtoList.length - 1; i++) {
                if (
                  this.rtoList[i].rb_rto_code ==
                  this.registrationNumber?.rb_rto_code
                ) {
                  this.vehicleDetailsForm.patchValue({
                    registration_city: this.rtoList[i],
                  });
                }
              }
            } else {
              for (let i = 0; i <= this.rtoList.length - 1; i++) {
                if (
                  this.rtoList[i].rb_rto_code ==
                  this.vehicleMMVValue?.rto_city?.rb_rto_code
                ) {
                  this.vehicleDetailsForm.patchValue({
                    registration_city: this.rtoList[i],
                  });
                }
              }
            }
          }
        } else {
          this.rtoDataNotAvailable = 'No data available';
          this.filteredRtoList = of(['No data']);
        }
      });
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterRTO(name: string): Observable<any[]> {
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_rto_list}?search_element=${name}`
      )
      .pipe(
        map((res) => {
          if (res && !res?.message) {
            if (Array.isArray(res)) {
              this.rtoList = res;
            } else if (typeof res === 'object') {
              this.rtoList = [res];
            }

            this.rtoDataNotAvailable =
              this.rtoList.length === 0 ? 'No data' : '';

            return this.rtoList;
          } else {
            this.rtoDataNotAvailable = 'No data available';
            this.filteredRtoList = of(['No data']);
          }
        })
      );
  }
  /**
   *
   * @param name displayMakeModel used for showing data
   * @returns
   */
  displayMakeModel(data?: any) {
    if (data != null && data != 'No data') {
      this.mmId = data.rb_mmv_id;

      return data ? data.displayMM : undefined;
    }
  }
  /**
   *
   * @param name onOptionMMSelected used for selected data
   * @returns
   */
  onOptionMMSelected(event: any) {
    if (event.option.value) {
      this.vehicleDetailsForm.patchValue({
        vehicle_variant: event.option.value,
        vehicle_fuel: event.option.value.fuel,
      });
    }
  }
  /**
   *
   * @param name onOptionMMSelected used for selected data
   * @returns
   */
  onVariantSelected(event: any) {
    if (event.option.value) {
      this.vehicleDetailsForm.patchValue({
        vehicle_fuel: event.option.value.fuel,
      });
    }
  }

  /**
   *
   * @param name displayMake used for display data
   * @returns
   */
  displayMake(data?: any) {
    if (data != null && data != 'No data' && !this.vehicleMakeOninit) {
      return data ? data.rb_make_name : '';
    } else if (data == 'No data') {
      return data;
    }
  }

  /**
   *
   * @param name displayModal used for display data
   * @returns
   */
  displayModal(data?: any) {
    if (data != null && data != 'No data' && !this.vehicleModelOninit) {
      return data ? data.rb_model_name : '';
    } else if (data == 'No data') {
      return data;
    }
  }
  /**
   *
   * @param name displayVariant used for display data
   * @returns
   */
  displayVariant(data?: any) {
    if (data != null && data != 'No data' && !this.vehicleVariantOnint) {
      this.fuelArray = [];
      this.fuelArray.push(data);
      this.fuelList = this.fuelArray;
      return data ? data.rb_variant_name : '';
    } else if (data == 'No data') {
      return data;
    }
  }
  /**
   *
   * @param name vehcileVariant used for selected data
   * @returns
   */
  vehcileVariant(data: any) {
    if (data == '') {
      this.filterVariantPopup('');
      // this.getVehicleMMVPopup('', '');
      // this.vehicleDetailsForm.patchValue({
      //   vehicle_model: '',
      //   vehicle_fuel: '',
      // });
    }
  }
  /**
   *
   * @param name displayRegistration used for selected data
   * @returns
   */
  displayRegistration(data?: any) {
    if (data != null && data != 'No data') {
      this.rtoId = data.rb_rto_id;
      return data ? data.display_name : undefined;
    }
  }
  /**
   *
   * @param name vehcileRegistration used for rto data
   * @returns
   */
  vehcileRegistration(data: any) {
    if (!this.vehicleRegistrationCityOninit) {
      if (data == '') {
        this.getRTOData('blank');
      }
      if (
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_model == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_variant == 'object' &&
        typeof this.vehicleDetailsForm.value.registration_city == 'object'
      ) {
        this.mmvBaseButtonDisable = false;
      } else {
        this.mmvBaseButtonDisable = true;
      }
    } else {
      this.vehicleRegistrationCityOninit = false;
    }
  }
  /**
   *
   * @param name previousInsurerComponentResponse used for rto data
   * @returns
   */
  previousInsurerComponentResponse(response: string) {
    if (!this.vehiclePreviousInsurerOninit) {
      if (
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_model == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_variant == 'object' &&
        typeof this.vehicleDetailsForm.value.registration_city == 'object' &&
        typeof response == 'object'
      ) {
        this.mmvBaseButtonDisable = false;
      } else {
        this.mmvBaseButtonDisable = true;
      }
    } else {
      this.vehiclePreviousInsurerOninit = false;
    }
  }
  inputClicked() {
    this.renderer.removeClass(document.body, 'dropdown-focus');
  }

  claimedPolicy(data: any) {
    if (data) {
      this.ncbDiscountData = false;
      this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
    } else {
      this.ncbDiscountData = true;
      if (this.renewalType == 'renewal') {
        this.vehicleDetailsForm.patchValue({
          ncb_discount: this.vehicleAllData?.renewalNCBDiscount,
        });
      }
    }
  }

  getExpiringPolicy(date?: any) {
    let expiringPolicyType;
    if (this.registrationNumber) {
      if (
        this.registrationNumber?.registration_month &&
        this.registrationNumber?.registration_year
      ) {
        this.regDateObj = `${this.registrationNumber?.registration_month}/${this.registrationNumber?.registration_year}`;

        expiringPolicyType = `?registration_date=${this.regDateObj}&vehicle_type=${this.vehicleTypeValue}`;
      }
    } else if (date) {
      let dateObj = moment(date, 'MM/YYYY');
      let regMonth = moment(dateObj).month();
      this.registrationMonth = moment(regMonth + 1, 'MM').format('MM');
      this.registrationYear = moment(dateObj).year();
      let regModifiedDate = `${this.registrationMonth}/${this.registrationYear}`;
      expiringPolicyType = `?registration_date=${regModifiedDate}&vehicle_type=${this.vehicleTypeValue}`;
    } else {
      this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
      let vehicleRegDate = new Date(this.vehicleMMVValue?.registration_date);

      let dateObj = moment(vehicleRegDate, 'MM/YYYY');
      let regMonth = moment(dateObj).month();
      this.registrationMonth = moment(regMonth + 1, 'MM').format('MM');
      this.registrationYear = moment(dateObj).year();
      let regModifiedDate = `${this.registrationMonth}/${this.registrationYear}`;
      expiringPolicyType = `?registration_date=${regModifiedDate}&vehicle_type=${this.vehicleTypeValue}`;
    }
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.getExpiringPolicy}${expiringPolicyType}`
      )
      ?.subscribe((res) => {
        if (res) {
          this.isNewVehicle = res?.is_new_vehicle;
          this.newVehicleData =
            res?.is_new_vehicle == false ? 'renewal' : 'new';
          sessionStorage.setItem('newVehicleType', this.newVehicleData);
          this.setUpdateValidetion(this.isNewVehicle);
          this.expiryList = res.expiring_policy_type;
          this.expiring_policy_type =
            this.expiryList[0]?.rb_expiring_policy_type_code;
          this.ncbDiscount = this.expiryList[0]?.offered_ncb_value;
          if (this.ncbDiscount) {
            this.getNcbList();
          }
          this.manufactureDate =
            this.registrationNumber?.manufactured_month &&
            this.registrationNumber?.manufactured_year
              ? moment(
                  `${this.registrationNumber?.manufactured_month}/${this.registrationNumber?.manufactured_year}`,
                  'MM/YYYY'
                )
              : null;

          if (!this.vehiclePopupList) {
            if (this.vehicleMMVValue?.policy_expiry_date === 'Not Sure') {
              for (let expiry of this.expiryList) {
                if (
                  expiry.rb_expiring_policy_type ===
                  "I don't know my expiring policy type"
                )
                  this.vehicleDetailsForm.patchValue({
                    manufacture_date: this.manufactureDate,
                    policy_expiry: expiry.rb_expiring_policy_type_code,
                    ncb_discount: this.ncbDiscount ? this.ncbDiscount : 0,
                  });
              }
            } else {
              this.vehicleDetailsForm.patchValue({
                policy_expiry: this.expiring_policy_type
                  ? this.expiring_policy_type
                  : '',
                ncb_discount: this.ncbDiscount ? this.ncbDiscount : 0,
              });
            }
          }
        }
      });
  }
  getNcbList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.ncb_list)
      .subscribe((res) => {
        this.expiryListData = res;
        for (let data of this.expiryListData) {
          if (!this.vehiclePopupList) {
            if (data.value === this.ncbDiscount) {
              this.vehicleDetailsForm.patchValue({
                ncb_discount: data.name,
              });
            }
          }
        }
      });
  }
  /**
   *   get expiry ploicy list api
   */
  getPolicyExpiryList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.expiry_policy_list)
      .subscribe((res) => {
        this.expiryPolicyList = res;
      });
  }

  /**
   * set from validation
   */
  setUpdateValidetion(isNewVehicle: boolean) {
    if (!isNewVehicle) {
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
        .get('previous_insurer')
        ?.setValidators([Validators.required]);
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
    } else {
      this.vehicleDetailsForm.get('policy_expiry_date')?.setValidators([]);
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
      this.vehicleDetailsForm.get('policy_expiry')?.setValidators([]);
      this.vehicleDetailsForm.get('policy_expiry')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_insurer')?.setValidators([]);
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
    }
    if (this.vehicleDetailsForm.value?.policy_expiry == 'IDK') {
      this.hideFieldOnExpiryPolicy(
        this.vehicleDetailsForm.value?.policy_expiry
      );
    }
  }
  /**
   *
   * @param name onExpiryPolicyChange used for expiring policy
   * @returns
   */
  onExpiryPolicyChange(event: MatSelectChange): void {
    this.hideFieldOnExpiryPolicy(event.value);
  }
  /**
   *
   * @param name hideFieldOnExpiryPolicy used for validation change in the form data
   * @returns
   */
  hideFieldOnExpiryPolicy(selectedValue: any) {
    if (selectedValue == 'IDK') {
      this.NoExpiryPolicy = true;
      this.hidePreviousClaimed = false;
      this.vehicleDetailsForm.get('policy_expiry_date')?.clearValidators();
      this.vehicleDetailsForm.get('previous_insurer')?.clearValidators();
      this.vehicleDetailsForm.get('previous_claimed')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_claimed')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_insurer')?.updateValueAndValidity();
      this.vehicleDetailsForm
        .get('policy_expiry_date')
        ?.updateValueAndValidity();
    } else if (selectedValue == 'satp' || selectedValue == 'bundled_tp') {
      this.NoExpiryPolicy = false;
      this.hidePreviousClaimed = false;
      this.vehicleDetailsForm.get('previous_claimed')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
      this.vehicleDetailsForm.get('previous_claimed')?.updateValueAndValidity();
    } else {
      this.NoExpiryPolicy = false;
      this.hidePreviousClaimed = true;
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
      // this.vehicleDetailsForm.value.ncb_discount = 0;
      this.vehicleDetailsForm.patchValue({
        ncb_discount: 0,
      });
      this.vehicleDetailsForm.get('ncb_discount')?.clearValidators();
      this.vehicleDetailsForm.get('ncb_discount')?.updateValueAndValidity();
    }
  }
  /**
   *
   * @param name onRCTransferChange used for validation change in the form data
   * @returns
   */
  onRCTransferChange(event: any) {
    if (!this.patchData) {
      if (event) {
        this.hidePreviousClaimed = false;
        this.vehicleDetailsForm.get('previous_claimed')?.setValue(false);
        this.vehicleDetailsForm.get('ncb_discount')?.setValue(null);
      } else {
        this.hidePreviousClaimed = true;
      }
    }
    this.patchData = false;
  }
  /**
   * navigates to the motor insurance  page
   */
  newNumber() {
    this.router.navigate(['/motor']);
    this.dialogRef.close();
  }
  /**
   * continue with current Journey
   */
  proccedToCurrentJourney(checkWheeler: any, rb_mmv_id: any) {
    if (checkWheeler['is_four_wheeler'] && !checkWheeler['is_two_wheeler']) {
      localStorage.setItem('vehicleType', 'private_car');
    }
    if (!checkWheeler['is_four_wheeler'] && checkWheeler['is_two_wheeler']) {
      localStorage.setItem('vehicleType', 'two_wheeler');
    }
    checkWheeler['is_four_wheeler'] = true;
    checkWheeler['is_two_wheeler'] = true;
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.getVehicleDetailsPopup('', '', '', rb_mmv_id, '');
    this.getRTOData('rto_code');
    sessionStorage.setItem('checkWheeler', JSON.stringify(checkWheeler));
    this.isCheckWheeler = true;
    this.dialogRef.removePanelClass('warn-details-class');
    this.dialogRef.addPanelClass('vehicle-details-class');
  }

  /**
Get the expiring policy list based on the given date or the registration details
@param date - The date for which the expiring policy list needs to be retrieved
 */
  expiryPolicyGetList(date: any, modifiedDate: any) {
    let expiringPolicyType;
    let vehicleType = localStorage.getItem('vehicleType');
    if (this.registrationNumber && modifiedDate == '') {
      if (
        this.registrationNumber?.registration_month &&
        this.registrationNumber?.registration_year
      ) {
        this.regDateObj = `${this.registrationNumber?.registration_month}/${this.registrationNumber?.registration_year}`;

        expiringPolicyType = `?registration_date=${this.regDateObj}&vehicle_type=${vehicleType}`;
      }
    } else if (date && modifiedDate == 'dateChange') {
      let dateObj = moment(date, 'MM/YYYY');
      let regMonth = moment(dateObj).month();
      this.registrationMonth = moment(regMonth + 1, 'MM').format('MM');
      this.registrationYear = moment(dateObj).year();
      let regModifiedDate = `${this.registrationMonth}/${this.registrationYear}`;
      expiringPolicyType = `?registration_date=${regModifiedDate}&vehicle_type=${vehicleType}`;
    } else if (date) {
      let dateObj = moment(date, 'MM/YYYY');
      let regMonth = moment(dateObj).month();
      this.registrationMonth = moment(regMonth + 1, 'MM').format('MM');
      this.registrationYear = moment(dateObj).year();
      let regModifiedDate = `${this.registrationMonth}/${this.registrationYear}`;
      expiringPolicyType = `?registration_date=${regModifiedDate}&vehicle_type=${vehicleType}`;
    } else {
      this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
      let vehicleRegDate = new Date(this.vehicleMMVValue?.registration_date);

      let dateObj = moment(vehicleRegDate, 'MM/YYYY');
      let regMonth = moment(dateObj).month();
      this.registrationMonth = moment(regMonth + 1, 'MM').format('MM');
      this.registrationYear = moment(dateObj).year();
      let regModifiedDate = `${this.registrationMonth}/${this.registrationYear}`;
      expiringPolicyType = `?registration_date=${regModifiedDate}&vehicle_type=${vehicleType}`;
    }
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.getExpiringPolicy}${expiringPolicyType}`
      )
      ?.subscribe((res) => {
        if (res) {
          if (modifiedDate == 'dateChange') {
            this.isNewVehicle = res?.is_new_vehicle;
            this.newVehicleData =
              res?.is_new_vehicle == false ? 'renewal' : 'new';
            sessionStorage.setItem('newVehicleType', this.newVehicleData);
          }

          this.expiryList = res.expiring_policy_type;
        }
      });
  }

  /**
   *
   * @param name vehcileMake used for Make data
   * @returns
   */

  vehcileMake(data: any) {
    if (data?.length >= 3 && !this.vehicleMakeOninit) {
      this.makeSelected = data;
      this.vehicleDetailsForm.get('vehicle_model')?.reset();
      this.vehicleDetailsForm.get('vehicle_variant')?.reset();
      this.vehicleDetailsForm.get('vehicle_fuel')?.reset();
      this.showSelectedFuelandCapacity = false;
      if (typeof this.vehicleDetailsForm.value.vehicle_make == 'object') {
        this.mmvBaseButtonDisable = false;
      } else {
        this.mmvBaseButtonDisable = true;
      }
    } else {
      this.vehicleMakeOninit = false;
    }
  }
  /**
   *
   * @param name vehcileModel used for Model data
   * @returns
   */
  vehcileModel(data: any) {
    if (data?.length >= 3 && !this.vehicleModelOninit) {
      this.modelSelected = data;
      this.vehicleDetailsForm.get('vehicle_variant')?.reset();
      this.vehicleDetailsForm.get('vehicle_fuel')?.reset();
      if (
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_model == 'object'
      ) {
        this.mmvBaseButtonDisable = false;
      } else {
        this.mmvBaseButtonDisable = true;
      }
    } else {
      this.vehicleModelOninit = false;
    }
  }
  /**
   *
   * @param name vehcileVarient used for Variant data
   * @returns
   */
  vehcileVarient(data: any) {
    this.showSelectedFuelandCapacity = false;
    if (data?.cubic_capacity) {
      this.showSelectedFuelandCapacity = true;
      this.cubicCapacitor = data?.cubic_capacity;
    }
    if (!this.vehicleVariantOnint) {
      this.vehicleDetailsForm.get('vehicle_fuel')?.reset();
      if (
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_model == 'object' &&
        typeof this.vehicleDetailsForm.value.vehicle_variant == 'object'
      ) {
        this.mmvBaseButtonDisable = false;
      } else {
        this.mmvBaseButtonDisable = true;
      }
    } else {
      this.vehicleVariantOnint = false;
    }
  }

  /**
   * Retrieves vehicle details based on the provided parameters.
   * If 'id' is provided, fetches data using 'rb_mmv_id'.
   * If 'id' is not provided, fetches data using 'make', 'model', 'variant', and 'product_name'.
   * Populates form fields and handles filtering based on API response.
   * @param make The make of the vehicle.
   * @param model The model of the vehicle.
   * @param variant The variant of the vehicle.
   * @param id The ID used to fetch specific vehicle details.
   */
  getVehicleDetailsPopup(
    make?: any,
    model?: any,
    variant?: any,
    id?: any,
    type?: any
  ) {
    let apiData;
    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    if (id) {
      apiData = `?product_name=${this.vehicleTypeValue}&rb_mmv_id=${id}`;
    } else {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      apiData = `?product_name=${this.vehicleTypeValue}&make=${make}&model=${model}&variant=${variant}`;
    }

    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res: any) => {
        if (Array.isArray(res)) {
          this.makeList = res;
          this.modelList = res;
          this.variantList = res;
          this.fuelList = res;
          if (id) {
            this.vehicleDetailsForm.patchValue({
              vehicle_MMV: res[0],
            });
          }

          if (this.registrationNumber && this.editClick == '') {
            const matchingModel = this.modelList.find(
              (model: any) =>
                model?.rb_mmv_id === this.registrationNumber?.rb_mmv_id
            );
            this.showSelectedFuelandCapacity = true;
            this.cubicCapacitor = matchingModel?.cubic_capacity;
            if (matchingModel) {
              this.renderer.addClass(document.body, 'dropdown-focus');
              this.vehicleDetailsForm.patchValue({
                vehicle_make: matchingModel,
                vehicle_model: matchingModel,
                vehicle_variant: matchingModel,
                vehicle_fuel: matchingModel.fuel,
                user_car: this.registrationNumber.is_ownership_transfer,
                previous_claimed: this.registrationNumber.is_claimed,
                previous_insurer: this.registrationNumber.previous_insurer_code,
              });
              this.makeValueSelected = matchingModel.rb_make_name;
              this.modelValueSelected = matchingModel.rb_model_name;
              this.variantValueSelected = matchingModel;
            }
            if (
              this.registrationNumber?.registration_month &&
              this.registrationNumber?.registration_year
            ) {
              let registrationDate = `${this.registrationNumber?.registration_month}/01/${this.registrationNumber?.registration_year}`;

              let dateObj = moment(registrationDate, 'MM/YYYY');
              this.vehicleDetailsForm.patchValue({
                registration_date: new Date(registrationDate),
              });
              this.getExpiringPolicy(dateObj);
            }
            if (
              this.registrationNumber?.manufactured_month &&
              this.registrationNumber?.manufactured_year
            ) {
              let manufactureDate = `${this.registrationNumber?.manufactured_month}/01/${this.registrationNumber?.manufactured_year}`;

              let manufacturedateObj = moment(manufactureDate, 'MM/YYYY');
              this.vehicleDetailsForm.patchValue({
                manufacture_date: new Date(manufactureDate),
              });
            }
            if (this.registrationNumber?.previous_policy_exp_date) {
              let inputDate = this.registrationNumber?.previous_policy_exp_date;
              let [day, month, year] = inputDate.split('-');
              let reformattedDate = `${month}/${day}/${year}`;
              if (!this.vehiclePopupList) {
                this.vehicleDetailsForm.patchValue({
                  policy_expiry_date: new Date(reformattedDate),
                });
              }
            }
          } else if (this.registrationNumber && this.editClick == 'edit') {
            this.showSelectedFuelandCapacity = false;
            let registrationDateObject;
            let manufactureDateObject;
            let previousInsurerObject;
            let registrationDate;
            this.patchData = true;
            this.vehiclePopupList = sessionStorage.getItem('mmv_data');
            let vehicleCard = JSON.parse(this.vehiclePopupList);
            this.vehicleAllData = vehicleCard;
            this.showSelectedFuelandCapacity = true;
            this.cubicCapacitor =
              this.vehicleAllData?.vehicle_variant?.cubic_capacity;
            if (this.vehicleAllData?.registration_date) {
              registrationDate = new Date(
                this.vehicleAllData?.registration_date
              );
              registrationDateObject = moment(registrationDate, 'MM/YYYY');
            }
            if (this.vehicleAllData?.manufacture_date) {
              let manufactureDate = new Date(
                this.vehicleAllData?.manufacture_date
              );
              manufactureDateObject = moment(manufactureDate, 'MM/YYYY');
            }
            if (this.vehicleAllData?.policy_expiry_date) {
              let policyExpiredDate = new Date(
                this.vehicleAllData?.policy_expiry_date
              );
              this.policyExpiredDateObject =
                moment(policyExpiredDate).format('MM/DD/YYYY');
            }
            this.renderer.addClass(document.body, 'dropdown-focus');
            this.vehicleDetailsForm.patchValue({
              vehicle_make: this.vehicleAllData.vehicle_make,
              vehicle_model: this.vehicleAllData.vehicle_model,
              vehicle_variant: this.vehicleAllData.vehicle_variant,
              registration_city: this.vehicleAllData.registration_city,
              vehicle_fuel: this.vehicleAllData.vehicle_fuel,
              registration_date: registrationDate,
              manufacture_date: manufactureDateObject,
              user_car: this.vehicleAllData.user_car,
              previous_claimed: this.vehicleAllData.previous_claimed,
              previous_insurer: this.vehicleAllData?.previous_insurer,
              ncb_discount: this.vehicleAllData?.ncb_discount,
              policy_expiry: this.vehicleAllData?.policy_expiry,
              policy_expiry_date: new Date(this.policyExpiredDateObject),
            });

            this.makeValueSelected = this.vehicleAllData.vehicle_make;
            this.modelValueSelected = this.vehicleAllData.vehicle_model;
            this.variantValueSelected = this.vehicleAllData.vehicle_variant;
          } else if (type == 'mmvData' && this.editClick == '') {
            this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
            const matchingModel = this.modelList.find(
              (model: any) =>
                model?.rb_mmv_id === this.vehicleMMVValue?.vehicle?.rb_mmv_id
            );
            if (matchingModel) {
              this.renderer.addClass(document.body, 'dropdown-focus');
              this.showSelectedFuelandCapacity = true;
              this.cubicCapacitor = matchingModel?.cubic_capacity;
            }
            this.vehicleDetailsForm.patchValue({
              vehicle_make: matchingModel,
              vehicle_model: matchingModel,
              vehicle_variant: matchingModel,
              // registration_city: this.vehicleMMVValue?.rto_city.display_name,
              vehicle_fuel: matchingModel.fuel,
            });
            if (this.editClick == '') {
              this.sharedDataService.getRegistrationDate(
                this.vehicleMMVValue?.registration_date
              );
              let regDateValue = new Date(
                this.vehicleMMVValue?.registration_date
              );

              this.vehicleDetailsForm.patchValue({
                registration_date: new Date(
                  this.vehicleMMVValue?.registration_date
                ),
                // vehicle_model: matchingModel,
                // vehicle_variant: matchingModel,
                // vehicle_fuel: matchingModel.fuel,
              });
            } else {
              let registrationDateObject;
              let registrationDate;
              if (this.vehicleAllData?.registration_date) {
                registrationDate = new Date(
                  this.vehicleAllData?.registration_date
                );
                registrationDateObject = moment(registrationDate, 'MM/YYYY');
              }
              this.vehicleDetailsForm.patchValue({
                registration_date: registrationDate,
              });
            }

            if (this.vehicleMMVValue?.policy_expiry_date) {
              let policyExpiryValue = new Date(
                this.vehicleMMVValue?.policy_expiry_date
              );
              if (policyExpiryValue && !this.vehiclePopupList) {
                this.convertExpiryDate = moment(
                  policyExpiryValue,
                  'MM/DD/YYYY'
                );
                this.vehicleDetailsForm.patchValue({
                  policy_expiry_date: new Date(this.convertExpiryDate),
                });
              }
            }

            if (this.vehicleMMVValue?.previous_insurer) {
              if (!this.vehiclePopupList) {
                this.vehicleDetailsForm.patchValue({
                  previous_insurer: this.vehicleMMVValue?.previous_insurer,
                });
              }
            }

            this.makeValueSelected = matchingModel.rb_make_name;
            this.modelValueSelected = matchingModel.rb_model_name;
            this.variantValueSelected = matchingModel;
          } else if (type == 'mmvData' && this.editClick == 'edit') {
            let registrationDateObject;
            let manufactureDateObject;
            let registrationDate;
            this.patchData = true;
            this.editVehiclePatch = false;
            this.hidePreviousClaimed = this.vehicleAllData?.hidePreviousClaimed;
            this.NoExpiryPolicy = this.vehicleAllData?.NoExpiryPolicy;
            if (this.vehicleAllData?.registration_date) {
              registrationDate = new Date(
                this.vehicleAllData?.registration_date
              );
              registrationDateObject = moment(registrationDate, 'MM/YYYY');
            }
            if (this.vehicleAllData?.manufacture_date) {
              let manufactureDate = new Date(
                this.vehicleAllData?.manufacture_date
              );
              manufactureDateObject = moment(manufactureDate, 'MM/YYYY');
            }
            if (this.vehicleAllData?.policy_expiry_date) {
              let policyExpiredDate = new Date(
                this.vehicleAllData?.policy_expiry_date
              );
              this.policyExpiredDateObject =
                moment(policyExpiredDate).format('MM/DD/YYYY');
            }

            this.vehicleDetailsForm.patchValue({
              vehicle_make: this.vehicleAllData.vehicle_make,
              vehicle_model: this.vehicleAllData.vehicle_model,
              vehicle_variant: this.vehicleAllData.vehicle_variant,
              registration_city: this.vehicleAllData.registration_city,
              vehicle_fuel: this.vehicleAllData.vehicle_fuel,
              registration_date: registrationDate,
              manufacture_date: manufactureDateObject,
              user_car: this.vehicleAllData.user_car,
              previous_claimed: this.vehicleAllData.previous_claimed,
              previous_insurer: this.vehicleAllData?.previous_insurer,
              ncb_discount: this.vehicleAllData?.ncb_discount,
              policy_expiry: this.vehicleAllData?.policy_expiry,
              policy_expiry_date: new Date(this.policyExpiredDateObject),
            });
          }

          if (res.length > 0) {
            this.filteredPopupMake = this.vehicleDetailsForm.controls[
              'vehicle_make'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterMakePopup(name) : this.makeList;
              })
            );
            this.filteredPopupModel = this.vehicleDetailsForm.controls[
              'vehicle_model'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterModelPopup(name) : [];
              })
            );
            this.mmDataNotAvailable = '';
            this.modelDataNotAvailable = '';
            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterVariantPopup(name) : [];
              })
            );
            // let regDateValue = new Date(
            //   this.vehicleMMVValue?.registration_date
            // );
            // this.vehicleDetailsForm.patchValue({
            //   registration_date: moment(regDateValue, 'MM/YYYY'),
            // });
            this.variantDataNotAvailable = '';
          } else {
            this.mmDataNotAvailable = 'No data';
            this.modelDataNotAvailable = 'No data';
            this.variantDataNotAvailable = 'No data';
            this.filteredPopupMake = this.vehicleDetailsForm.controls[
              'vehicle_model'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterMakePopup(name) : ['No data'];
              })
            );

            this.filteredPopupModel = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterModelPopup(name) : ['No data'];
              })
            );

            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterVariantPopup(name) : ['No data'];
              })
            );
          }
        } else {
          /**
           * Handle non-array data, such as error messages
           */
          this.mmDataNotAvailable = res.message;
          this.modelDataNotAvailable = res.message;
          this.variantDataNotAvailable = res.message;
          /**
           * Other error handling logic
           */
        }
      });
  }
  /**
   *
   * @param name filterMakePopup used for filter Make data
   * @returns
   */
  filterMakePopup(name: string) {
    if (typeof name != 'object' && name.length >= 3) {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&make=${name}&model=&variant=`
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res) && res.length > 0) {
              this.makeList = res;
              this.filteredPopupMake = this.vehicleDetailsForm.controls[
                'vehicle_make'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterMakePopup(name) : this.makeList;
                })
              );
              this.mmDataNotAvailable = '';

              this.mmDataNotAvailable = '';
            } else {
              this.mmDataNotAvailable = 'No data';
              this.filteredPopupMMV = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterMakePopup(name) : ['No data'];
                })
              );
            }
          },
          (error) => {}
        );
    }
  }

  /**
   *
   * @param name filterModelPopup used for filter Model data
   * @returns
   */
  filterModelPopup(name: string) {
    if (typeof name != 'object' && name.length >= 3) {
      let selectedMakeValue =
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object'
          ? this.vehicleDetailsForm.value.vehicle_make.rb_make_name
          : this.vehicleDetailsForm.value.vehicle_make;
      this.renderer.removeClass(document.body, 'dropdown-focus');
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&make=${selectedMakeValue}&model=${name}&variant=`
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res) && res.length > 0) {
              this.variantList = res;

              this.modelDataNotAvailable = '';
              this.filteredPopupModel = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterModelPopup(name) : this.variantList;
                })
              );
            } else {
              this.modelDataNotAvailable = 'No data';
              this.filteredPopupModel = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterModelPopup(name) : ['No data'];
                })
              );
            }
          },
          (error) => {}
        );
    }
  }
  /**
   *
   * @param name filterVariantPopup used for filter Variant data
   * @returns
   */
  filterVariantPopup(name: string) {
    if (typeof name != 'object' && name.length >= 2) {
      let selectedMakeValue =
        typeof this.vehicleDetailsForm.value.vehicle_make == 'object'
          ? this.vehicleDetailsForm.value.vehicle_make.rb_make_name
          : this.vehicleDetailsForm.value.vehicle_make;

      let selectedModalValue =
        typeof this.vehicleDetailsForm.value.vehicle_model == 'object'
          ? this.vehicleDetailsForm.value.vehicle_model.rb_model_name
          : this.vehicleDetailsForm.value.vehicle_model;
      this.renderer.removeClass(document.body, 'dropdown-focus');
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&make=${selectedMakeValue}&model=${selectedModalValue}&variant=${name}`
        )
        .subscribe(
          (res: any) => {
            if (Array.isArray(res) && res.length > 0) {
              // Assuming res is already an array of objects with rb_variant_name property
              this.variantList = res;
              this.fuelList = res;

              this.variantDataNotAvailable = '';
              this.fuelData = Object.values(
                this.fuelList.reduce(
                  (data: any, obj: { fuel: any; id: any }) => ({
                    ...data,
                    [obj.fuel]: obj,
                  }),
                  {}
                )
              );
              this.filteredPopupVariant = this.vehicleDetailsForm.controls[
                'vehicle_variant'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name
                    ? this.filterVariantPopup(name)
                    : this.variantList;
                })
              );
            } else {
              this.variantDataNotAvailable = 'No data';
              this.filteredPopupVariant = this.vehicleDetailsForm.controls[
                'vehicle_variant'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filterVariantPopup(name) : ['No data'];
                })
              );
            }
          },
          (error) => {
            // Handle API error if needed
          }
        );
    }
  }
  /**
   *
   * @param name filterVarientPopup used for filter Variant data
   * @returns
   */
  filterVarientPopup(name: string) {
    if (typeof name != 'object' && name.length >= 2) {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&make=${this.modelSelected}&model=${name}&variant=`
        )
        .subscribe(
          (res) => {
            if (Array.isArray(res) && res.length > 0) {
              this.variantList = res.map((item) => ({
                ...item,
                displayMM: `${item.rb_variant_name}`,
              }));
              this.variantList = res;
              this.fuelList = res;

              this.mmDataNotAvailable = '';
              this.fuelData = Object.values(
                this.fuelList.reduce(
                  (data: any, obj: { fuel: any; id: any }) => ({
                    ...data,
                    [obj.fuel]: obj,
                  }),
                  {}
                )
              );
              this.filteredPopupVariant = this.vehicleDetailsForm.controls[
                'vehicle_variant'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name
                    ? this.filterVarientPopup(name)
                    : this.variantList;
                })
              );

              this.mmDataNotAvailable = '';
            } else {
              this.mmDataNotAvailable = 'No data';
              this.filteredPopupVariant = this.vehicleDetailsForm.controls[
                'vehicle_model'
              ].valueChanges.pipe(
                debounceTime(500),
                startWith(''),
                map((name) => {
                  return name ? this.filteredPopupVariant(name) : ['No data'];
                })
              );
            }
          },
          (error) => {}
        );
    }
  }
  /**
   * Handles the selection of a Make from the Make dropdown.
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
    this.variantValueSelected = event.option.value.rb_variant_name;
    this.showSelectedFuelandCapacity = true;
    // this.fuelList = event.option.value;
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
}
