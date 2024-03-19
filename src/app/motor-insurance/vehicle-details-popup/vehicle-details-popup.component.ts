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
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
  /**
   * MMV is use for (Make Model Variant)
   * filteredMMV used for the filter MMV data
   */
  filteredPopupMMV!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  filteredPopupVariant!: any;
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
      if (res === 'edit') {
        this.editVehicleDetails = false;
        this.vehiclePopupList = sessionStorage.getItem('mmv_data');
        let vehicleCard = JSON.parse(this.vehiclePopupList);
        if (vehicleCard) {
          this.patchVehicleData(vehicleCard);
        }
      }
    });
  }
  /**
   * Initialize the form using FormBuilder
   */
  vehicleDetailsFormControler() {
    this.vehicleDetailsForm = this.FormBuilder.group({
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
      registration_date: [moment(), Validators.required],
      previous_insurer: [''],
    });
  }

  withRegistrationNumber: any;
  changeRegNumber: any;
  registrationNumber: any;
  dataWithoutRegistration: any;
  ngOnInit(): void {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    this.sharedDataService.regNumberData.subscribe((numberData) => {
      this.registrationNumber = numberData;
      if (this.registrationNumber?.rb_mmv_id) {
        this.getVehicleMMVPopup('', this.registrationNumber.rb_mmv_id);
      }
    });
    this.sharedDataService.getValueWithoutRegistration.subscribe((res) => {
      this.dataWithoutRegistration = res;
    });
    this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
    this.rto_id = this.vehicleMMVValue?.rto_city?.rb_rto_id;

    // if (this.vehicleMMVData) {
    //   this.sharedDataService.vehicleMMVDetails(
    //     this.vehicleMMVData,
    //     '',
    //     'mmvQuotes'
    //   );
    // }

    // let popup
    setTimeout(() => {
      if (this.registrationNumber?.rb_mmv_id) {
        // this.getVehicleMMVPopup('', this.registrationNumber.rb_mmv_id);
      } else {
        this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);

        this.getVehicleMMVPopup(
          '',
          this.vehicleMMVValue?.vehicle.rb_mmv_id,
          'mmvData'
        );
      }
      this.getExpiringPolicy();
      this.getRTOData('rto_code');
      this.getNcbList();
      this.getPolicyExpiryList();
    }, 2000);

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
      this.getExpiringPolicy(regDateValue);
    });
    this.checkWheelerType(this.editVehicleDetails);
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
    let manufactureDateObject;
    let previousInsurerObject;
    this.patchData = true;
    this.hidePreviousClaimed = data?.hidePreviousClaimed;
    this.NoExpiryPolicy = data?.NoExpiryPolicy;
    if (data?.registration_date) {
      let registrationDate = new Date(data?.registration_date);
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

    this.vehicleDetailsForm.patchValue({
      vehicle_model: data.vehicle_model,
      vehicle_variant: data.vehicle_variant,
      registration_city: data.registration_city,
      vehicle_fuel: data.vehicle_fuel,
      registration_date: registrationDateObject,
      manufacture_date: manufactureDateObject,
      user_car: data.user_car,
      previous_claimed: data.previous_claimed,
      previous_insurer: data?.previous_insurer,
      ncb_discount: data?.ncb_discount,
      policy_expiry: data?.policy_expiry,
      policy_expiry_date: new Date(this.policyExpiredDateObject),
    });
    this.onRCTransferChange(data.user_car);
    this.claimedPolicy(data.previous_claimed);
  }

  onClose(): void {
    this.renderer.removeClass(document.body, 'dropdown-focus');
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }

  updateVehicleDetail() {
    this.renderer.removeClass(document.body, 'dropdown-focus');
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }

    sessionStorage.setItem('vehiclePopup', 'true');
    this.vehicleDetailsForm.value.NoExpiryPolicy = this.NoExpiryPolicy;
    this.vehicleDetailsForm.value.hidePreviousClaimed =
      this.hidePreviousClaimed;

    if (this.vehicleDetailsForm.value?.policy_expiry != 'IDK') {
      if (this.vehicleDetailsForm.value?.ncb_discount) {
        for (let i = 0; i <= this.expiryListData.length - 1; i++) {
          if (
            this.expiryListData[i].new_ncb_value ==
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

    let vehicleFrom = JSON.stringify(this.vehicleDetailsForm.value);

    sessionStorage.setItem('mmv_data', vehicleFrom);
    this.sharedDataService.vehicleCardData(vehicleFrom);
  }

  /**
   * Fetches the list of vehicle makes, models, and variants based on the vehicle type and stores them in the component's state.
   * @param name - The search term used to filter the list of makes, models, and variants.
   * @param id - The ID of the make, model, or variant to be preselected.
   */
  getVehicleMMVPopup(name: any, id: any, type?: any) {
    let apiData;
    if (id) {
      apiData = `?product_name=${this.vehicleTypeValue}&rb_mmv_id=${id}`;
    } else {
      this.renderer.removeClass(document.body, 'dropdown-focus');
      apiData = `?product_name=${this.vehicleTypeValue}`;
    }
    this.apiservice
      .getRequestedResponse(`${ApiConstants.get_vehicle_mmv}${apiData}`)
      .subscribe((res) => {
        if (res) {
          this.modelList = res;
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
          for (let i = 0; i <= this.modelList.length - 1; i++) {
            this.modelList[
              i
            ].displayMM = `${this.modelList[i].rb_make_name} | ${this.modelList[i].rb_model_name}`;
          }
          if (this.registrationNumber) {
            const matchingModel = this.modelList.find(
              (model: any) =>
                model?.rb_mmv_id === this.registrationNumber?.rb_mmv_id
            );
            if (matchingModel) {
              this.renderer.addClass(document.body, 'dropdown-focus');
              this.vehicleDetailsForm.patchValue({
                vehicle_model: matchingModel,
                vehicle_variant: matchingModel,
                vehicle_fuel: matchingModel.fuel,
                user_car: this.registrationNumber.is_ownership_transfer,
                previous_claimed: this.registrationNumber.is_claimed,
                previous_insurer: this.registrationNumber.previous_insurer_code,
              });
            }

            if (
              this.registrationNumber?.registration_month &&
              this.registrationNumber?.registration_year
            ) {
              let registrationDate = `${this.registrationNumber?.registration_month}/${this.registrationNumber?.registration_year}`;
              let dateObj = moment(registrationDate, 'MM/YYYY');
              this.vehicleDetailsForm.patchValue({
                registration_date: dateObj,
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
          } else if (type == 'mmvData') {
            this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);
            const matchingModel = this.modelList.find(
              (model: any) =>
                model?.rb_mmv_id === this.vehicleMMVValue?.vehicle?.rb_mmv_id
            );
            if (matchingModel) {
              this.renderer.addClass(document.body, 'dropdown-focus');
              this.vehicleDetailsForm.patchValue({
                vehicle_model: matchingModel,
                vehicle_variant: matchingModel,
                vehicle_fuel: matchingModel.fuel,
              });
            }
            let regDateValue = new Date(
              this.vehicleMMVValue?.registration_date
            );
            this.sharedDataService.getRegistrationDate(
              this.vehicleMMVValue?.registration_date
            );
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

            this.vehicleDetailsForm.patchValue({
              registration_date: moment(regDateValue, 'MM/YYYY'),
            });

            if (this.vehicleMMVValue?.previous_insurer) {
              if (!this.vehiclePopupList) {
                this.vehicleDetailsForm.patchValue({
                  previous_insurer: this.vehicleMMVValue?.previous_insurer,
                });
              }
            }
          }

          if (res.length > 0) {
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

            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterVariantPopup(name) : this.variantList;
              })
            );

            this.variantDataNotAvailable = '';
          } else {
            this.mmDataNotAvailable = res.message;
            this.variantDataNotAvailable = res.message;

            this.filteredPopupMMV = this.vehicleDetailsForm.controls[
              'vehicle_model'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterMMVPopup(name) : ['No data'];
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
        }
      });
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
  filterVariantPopup(name: string) {
    // this.apiservice
    //   .getRequestedResponse(
    //     `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&search_element=${name}`
    //   )
    //   .subscribe(
    //     (res) => {
    //       if (Array.isArray(res) && res.length > 0) {
    // this.variantList = res;

    if (this.variantList) {
      this.filteredPopupVariant = this.vehicleDetailsForm.controls[
        'vehicle_variant'
      ].valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        map((value) => {
          return value ? this.filterVariantPopup(value) : this.variantList;
        })
      );

      this.variantDataNotAvailable = '';
    } else {
      this.variantDataNotAvailable = 'No data';
      this.filteredPopupVariant = this.vehicleDetailsForm.controls[
        'vehicle_variant'
      ].valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        map((value) => {
          return value ? this.filterVariantPopup(value) : ['No data'];
        })
      );
    }
    // },
    // (error) => {
    //   console.error('API Request Error:', error);
    // }
    // );
  }

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

  displayMakeModel(data?: any) {
    if (data != null && data != 'No data') {
      this.mmId = data.rb_mmv_id;

      return data ? data.displayMM : undefined;
    }
  }

  onOptionMMSelected(event: any) {
    if (event.option.value) {
      this.vehicleDetailsForm.patchValue({
        vehicle_variant: event.option.value,
        vehicle_fuel: event.option.value.fuel,
      });
    }
  }

  onVariantSelected(event: any) {
    if (event.option.value) {
      this.vehicleDetailsForm.patchValue({
        vehicle_fuel: event.option.value.fuel,
      });
    }
  }
  vehcileMM(data: any) {
    if (data == '') {
      this.getVehicleMMVPopup('', '');
      // this.vehicleDetailsForm.patchValue({
      //   vehicle_variant: '',
      //   vehicle_fuel: '',
      // });
    }
  }

  displayVariant(data?: any) {
    if (data != null && data != 'No data') {
      this.variantId = data.rb_mmv_id;

      return data ? data.rb_variant_name : undefined;
    }
  }
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

  displayRegistration(data?: any) {
    if (data != null && data != 'No data') {
      this.rtoId = data.rb_rto_id;
      return data ? data.display_name : undefined;
    }
  }
  vehcileRegistration(data: any) {
    if (data == '') {
      this.getRTOData('blank');
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
                manufacture_date: this.manufactureDate,
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
  onExpiryPolicyChange(event: MatSelectChange): void {
    this.hideFieldOnExpiryPolicy(event.value);
  }
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
    this.getVehicleMMVPopup('', rb_mmv_id);
    this.getRTOData('rto_code');
    sessionStorage.setItem('checkWheeler', JSON.stringify(checkWheeler));
    this.isCheckWheeler = true;
  }
}
