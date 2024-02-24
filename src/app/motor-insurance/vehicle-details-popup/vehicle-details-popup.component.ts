import {
  Component,
  Inject,
  Input,
  OnInit,
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
import { Observable, debounceTime, map, startWith } from 'rxjs';
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
    public bottomSheetRef: MatBottomSheetRef<VehicleDetailsPopupComponent>
  ) {
    this.vehicleDetailsFormControler();
    this.getClaimedList();
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
      policy_expiry_date: [''],
      policy_expiry: [''],
      previous_claimed: [''],
      ncb_discount: [''],
      manufacture_date: [moment(), Validators.required],
      registration_date: [moment(), Validators.required],
      previous_insurer: [''],
    });
  }

  /**
   * this function use for get expiry list
   */
  getClaimedList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.exp_policy_type)
      .subscribe((res) => {
        this.expiryList = res;
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

    setTimeout(() => {
      if (this.registrationNumber?.rb_mmv_id) {
        this.getVehicleMMVPopup('', this.registrationNumber.rb_mmv_id);
      }
      this.getRTOData();
    }, 2000);

    let regNumber = sessionStorage.getItem('registrationNumber');
    if (regNumber) {
      this.sharedDataService.vehicleDetails('registrationNumber');
    }

    let vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
    if (vehicleMMVData) {
      this.sharedDataService.vehicleMMVDetails(vehicleMMVData, 'mmvQuotes');
    }
  }

  onClose(): void {
    if (window.innerWidth <= 768) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }

  updateVehicleDetail() {
    if (window.innerWidth <= 768) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }

  getVehicleMMVPopup(name: any, id: any) {
    let apiData;
    if (id) {
      apiData = `?product_name=${this.vehicleTypeValue}&rb_mmv_id=${id}`;
    } else {
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
              (
                data: any,
                obj: {
                  fuel: any;
                  id: any;
                }
              ) => ({ ...data, [obj.fuel]: obj }),
              {}
            )
          );

          for (let i = 0; i <= this.modelList.length - 1; i++) {
            this.modelList[
              i
            ].displayMM = `${this.modelList[i].rb_make_name} | ${this.modelList[i].rb_model_name}`;
          }
          for (let i = 0; i <= this.modelList.length - 1; i++) {
            if (
              this.modelList[i].rb_mmv_id == this.registrationNumber.rb_mmv_id
            ) {
              this.vehicleDetailsForm.patchValue({
                vehicle_model: this.modelList[i],
                vehicle_variant: this.modelList[i],
                vehicle_fuel: this.modelList[i].fuel,
                user_car: this.registrationNumber.is_ownership_transfer,
                previous_claimed: this.registrationNumber.is_claimed,
                previous_insurer: this.registrationNumber.previous_insurer_code,
              });
            }
          }

          if (
            this.registrationNumber?.registration_month &&
            this.registrationNumber?.registration_year
          ) {
            let registartIonDate = `${this.registrationNumber?.registration_month}/${this.registrationNumber?.registration_year}`;

            let dateObj = moment(registartIonDate, 'MM/YYYY');

            this.vehicleDetailsForm.patchValue({
              registration_date: dateObj,
            });
          }
          if (this.registrationNumber?.previous_policy_exp_date) {
            let inputDate = this.registrationNumber?.previous_policy_exp_date; // Assuming the format is dd-mm-yyyy

            // Destructuring assignment to extract day, month, and year
            let [day, month, year] = inputDate.split('-');

            // Reformatting to mm-dd-yyyy format
            let reformattedDate = month + '-' + day + '-' + year;

            this.vehicleDetailsForm.patchValue({
              policy_expiry_date: new Date(reformattedDate),
            });
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
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.modelList = res;
          for (let i = 0; i <= this.modelList.length - 1; i++) {
            this.modelList[
              i
            ].displayMM = `${this.modelList[i].rb_make_name} | ${this.modelList[i].rb_model_name}`;
          }
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
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
          } else {
            this.mmDataNotAvailable = res.message;

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
        }
      });
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterVariantPopup(name: string) {
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}&search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.variantList = res;
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              startWith(''),
              map((name) => {
                return name ? this.filterVariantPopup(name) : this.variantList;
              })
            );

            this.variantDataNotAvailable = '';
          } else {
            this.variantDataNotAvailable = res.message;
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

  getRTOData() {
    this.apiservice
      .getRequestedResponse(ApiConstants.get_rto_list)
      .subscribe((res) => {
        if (res) {
          this.rtoList = res;
          if (this.registrationNumber?.rb_rto_code) {
            for (let i = 0; i <= this.rtoList.length - 1; i++) {
              if (
                this.rtoList[i].rb_rto_code ==
                this.registrationNumber.rb_rto_code
              ) {
                this.vehicleDetailsForm.patchValue({
                  registration_city: this.rtoList[i],
                });
              }
            }
          }

          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.rtoDataNotAvailable = '';
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterRTO(name) : this.rtoList;
              })
            );
          
          } else {
            this.rtoDataNotAvailable = res.message;
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterRTO(name) : ['No data'];
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
  filterRTO(name: string) {
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_rto_list}?search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.rtoList = res;
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.rtoDataNotAvailable = '';
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterRTO(name) : this.rtoList;
              })
            );
          } else {
            this.rtoDataNotAvailable = res.message;
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              map((name) => {
                return name ? this.filterRTO(name) : ['No data'];
              })
            );
          }
        }
      });
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
        vehicle_model: event.option.value,
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
      this.getVehicleMMVPopup('', '');
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
      this.getRTOData();
    }
  }

  claimedPolicy(data: any) {
    if (data.value.claimedName == 'No') {
      this.ncbDiscountData = true;
    } else {
      this.ncbDiscountData = false;
    }
  }
}
