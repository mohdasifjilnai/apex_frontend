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
  ncbDiscountData = false;
  vehicleMMVValue: any;
  vehicleMMVData: any;
  convertExpiryDate: any;
  mmvData: any = [];
  expiringPolicy: any;
  regNumber: any;
  registrationMonth: any;
  registrationYear: any;
  regDateObj: any;

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

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private FormBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private apiservice: ApiService,
    public bottomSheetRef: MatBottomSheetRef<VehicleDetailsPopupComponent>,
    private renderer: Renderer2
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

    /**
     * Sample data for the Previous Year NCB Discount dropdown list
     */
    this.ncbList = [
      {
        id: 1,
        ncbName: '0%',
      },
    ];

    this.sharedDataService.getVehicleDetails.subscribe((res) => {
      if (res === 'edit') {
        this.editVehicleDetails = false;
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
      policy_expiry_date: ['', Validators.required],
      policy_expiry: ['', Validators.required],
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
  ngOnInit(): void {
    this.vehicleTypeValue = localStorage.getItem('vehicleType');

    this.sharedDataService.regNumberData.subscribe((numberData) => {
      this.registrationNumber = numberData;
    });

    this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);

    if (this.vehicleMMVData) {
      this.sharedDataService.vehicleMMVDetails(
        this.vehicleMMVData,
        'mmvQuotes'
      );
    }
    setTimeout(() => {
      if (this.registrationNumber?.rb_mmv_id) {
        this.getVehicleMMVPopup('', this.registrationNumber.rb_mmv_id);
      } else {
        this.vehicleMMVValue = JSON.parse(this.vehicleMMVData);

        this.getVehicleMMVPopup(
          '',
          this.vehicleMMVValue?.vehicle.rb_mmv_id,
          'mmvData'
        );
      }
      this.getExpiringPolicy();
      this.getRTOData();
    }, 2000);

    this.regNumber = sessionStorage.getItem('registrationNumber');
    if (this.regNumber) {
      this.sharedDataService.vehicleDetails('registrationNumber');
    }

    this.vehicleDetailsForm.patchValue({
      user_car: false,
      previous_claimed: false,
    });

    this.sharedDataService.getRegistrationData.subscribe((res) => {
      // this.maxManufactureDate = new Date(res);
      let regDateValue = new Date(res);
      this.getExpiringPolicy(regDateValue);
    });
  }

  onClose(): void {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }

  updateVehicleDetail() {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
    let vehicleFrom = JSON.stringify(this.vehicleDetailsForm.value);
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
              this.mmvData.push(matchingModel);
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
              let reformattedDate = `${month}-${day}-${year}`;
              this.vehicleDetailsForm.patchValue({
                policy_expiry_date: new Date(reformattedDate),
              });
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
            let policyExpiryValue = new Date(
              this.vehicleMMVValue?.policy_expiry_date
            );
            this.vehicleDetailsForm.patchValue({
              registration_date: moment(regDateValue, 'MM/YYYY'),
            });
            if (policyExpiryValue) {
              this.convertExpiryDate = moment(policyExpiryValue, 'MM/DD/YYYY');
              this.vehicleDetailsForm.patchValue({
                policy_expiry_date: new Date(this.convertExpiryDate),
              });
            }

            if (this.vehicleMMVValue?.previous_insurer) {
              this.vehicleDetailsForm.patchValue({
                previous_insurer: this.vehicleMMVValue?.previous_insurer,
              });
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
    this.apiservice
      .getRequestedResponse(ApiConstants.get_rto_list)
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
                  this.mmvData.push(this.rtoList[i]);
                  sessionStorage.setItem(
                    'mmv_data',
                    JSON.stringify(this.mmvData)
                  );

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
                  this.mmvData.push(this.rtoList[i]);
                  sessionStorage.setItem(
                    'mmv_data',
                    JSON.stringify(this.mmvData)
                  );

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
    if (data.value.claimedName == 'yes') {
      this.ncbDiscountData = true;
    } else {
      this.ncbDiscountData = false;
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
      .subscribe((res) => {
        if (res) {
          this.expiryList = res.expiring_policy_type;
          this.vehicleDetailsForm.patchValue({
            policy_expiry: '',
            ncb_discount: '',
          });
        }
      });
  }
}
