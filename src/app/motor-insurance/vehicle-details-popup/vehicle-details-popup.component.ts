import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-vehicle-details-popup',
  templateUrl: './vehicle-details-popup.component.html',
  styleUrls: ['./vehicle-details-popup.component.scss'],
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
  ) {
    /**
     * Initialize the form using FormBuilder
     */
    this.vehicleDetailsForm = this.FormBuilder.group({
      vehicle_model: ['', Validators.required],
      vehicle_variant: ['', Validators.required],
      vehicle_fuel: ['', Validators.required],
      registration_city: ['', Validators.required],
      user_car: ['', Validators.required],
      policy_expiry: ['', Validators.required],
      previous_claimed: ['', Validators.required],
      ncb_discount: ['', Validators.required],
      manufacture_date: ['', Validators.required],
      registration_date: ['', Validators.required],
      previous_insurer: ['', Validators.required],
    });

    /**
     * Sample data for the Used Car/RC Transfer dropdown list
     */
    this.rcList = [
      {
        id: 1,
        rcName: 'Yes',
      },
      {
        id: 2,
        rcName: 'No',
      },
    ];

    /**
     * Sample data for the Type of Expiring Policy dropdown list
     */
    this.expiryList = [
      {
        id: 1,
        expiryName: 'Bundled (1 Year OD + 3 Year TP)',
      },
    ];

    /**
     * Sample data for the Is Previous Policy Claimed dropdown list
     */
    this.claimedList = [
      {
        id: 1,
        claimedName: 'No',
      },
    ];

    /**
     * Sample data for the Previous Year NCB Discount dropdown list
     */
    this.ncbList = [
      {
        id: 1,
        ncbName: '35%',
      },
    ];

    this.sharedDataService.getVehicleDetails.subscribe((res) => {
      if (res === 'edit') {
        this.editVehicleDetails = false;
      }
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
      this.getVehicleMMVPopup('');
      this.getRTOData();
    }, 2000);

    let regNumber = sessionStorage.getItem('registrationNumber');
    if (regNumber) {
      this.sharedDataService.vehicleDetails();
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

  getVehicleMMVPopup(name: any) {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehicleTypeValue}`
      )
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

          /**
           * when input field value changes than valueChanges is used
           */
          this.vehicleDetailsForm.patchValue({
            vehicle_fuel: this.registrationNumber.fuel_type,
          });
          this.vehicleDetailsForm.patchValue({
            registration_date : new Date(this.registrationNumber.registration_date)
          })

          if (res.length > 0) {
            this.filteredPopupMMV = this.vehicleDetailsForm.controls[
              'vehicle_model'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterMMVPopup(name) : this.modelList;
              })
            );
            this.mmDataNotAvailable = '';
            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(1000),
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
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterMMVPopup(name) : ['No data'];
              })
            );

            this.filteredPopupVariant = this.vehicleDetailsForm.controls[
              'vehicle_variant'
            ].valueChanges.pipe(
              debounceTime(1000),
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
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.filteredPopupMMV = this.vehicleDetailsForm.controls[
              'vehicle_model'
            ].valueChanges.pipe(
              debounceTime(1000),
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
              debounceTime(1000),
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
              debounceTime(1000),
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
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.rtoDataNotAvailable = '';
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterRTO(name) : this.rtoList;
              })
            );
            for (let i = 0; i <= this.rtoList.length - 1; i++) {
              if (
                this.rtoList[i].rb_rto_code == this.registrationNumber.rto_code
              ) {
                this.vehicleDetailsForm.patchValue({
                  registration_city: this.rtoList[i],
                });
              }
            }
          } else {
            this.rtoDataNotAvailable = res.message;
            this.filteredRtoList = this.vehicleDetailsForm.controls[
              'registration_city'
            ].valueChanges.pipe(
              debounceTime(1000),
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
              debounceTime(1000),
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
              debounceTime(1000),
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
      return data ? data.rb_make_name : undefined;
    }
  }
  vehcileMM(data: any) {
    if (data == '') {
      this.getVehicleMMVPopup('');
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
      this.getVehicleMMVPopup('');
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
}
