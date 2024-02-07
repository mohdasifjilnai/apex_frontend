import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
  vehcileType:any;
  mmvList:any;
  rtoList:any;
    /**
   * MMV is use for (Make Model Variant)
   * filteredMMV used for the filter MMV data
   */
    filteredPopupMMV!: Observable<any[]>;
    @ViewChild(MatAutocompleteTrigger)
    autocomplete!: MatAutocompleteTrigger;

    filteredPopupVariant!: Observable<any[]>;
    @ViewChild(MatAutocompleteTrigger)
    autocompleteVariant!: MatAutocompleteTrigger;


    filteredRtoList!: Observable<any[]>;
    

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private FormBuilder: FormBuilder,
    private sharedData: SharedDataService,
    private apiservice: ApiService,
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
     * Sample data for the Make/Model dropdown list
     */
    
    // this.modelList = [
    //   {
    //     id: 1,
    //     modelName: 'Maruti Ciaz',
    //   },
    // ];

    /**
     * Sample data for the Variant dropdown list
     */
    // this.variantList = [
    //   {
    //     id: 1,
    //     modelName: 'Maruti Ciaz',
    //   },
    // ];

    /**
     * Sample data for the Fuel dropdown list
     */
    this.fuelList = [
      {
        id: 1,
        fuelName: 'CNG',
      },
    ];

    /**
     * Sample data for the Registration City dropdown list
     */
    // this.cityList = [
    //   {
    //     id: 1,
    //     cityName: 'Delhi',
    //   },
    // ];

    /**
     * Sample data for the Used Car/RC Transfer dropdown list
     */
    this.rcList = [
      {
        id: 1,
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

    this.sharedData.getVehicleDetails.subscribe((res) => {
      if (res === 'edit') {
        this.editVehicleDetails = false;
      }
    });
  }
  ngOnInit(): void {
    this.sharedData.getSelectedVehicleType.subscribe((res) => {
      this.vehcileType = res;
      this.getVehicleMMVPopup('', this.vehcileType);
      this.getRTOData()
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }


  getVehicleMMVPopup(name: any, vehicletype: any) {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehcileType}`
      )
      .subscribe((res) => {
        if (res) {
          this.modelList = res;
          this.variantList = res;
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
          this.filteredPopupMMV = this.vehicleDetailsForm.controls['vehicle_model'].valueChanges.pipe(
            debounceTime(1000),
            startWith(''),
            map((name) => {
              return name ? this.filterMMVPopup(name) : this.modelList;
            })
          );

          this.filteredPopupVariant = this.vehicleDetailsForm.controls['vehicle_variant'].valueChanges.pipe(
            debounceTime(1000),
            startWith(''),
            map((name) => {
              return name ? this.filterVariantPopup(name) : this.variantList;
            })
          );
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
          `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehcileType}&search_element=${name}`
        )
        .subscribe((res) => {
          if (res) {
            this.modelList = res;
            // this.filteredMMV = this.mmvList;
            /**
             * when input field value changes than valueChanges is used
             */
            this.filteredPopupMMV = this.vehicleDetailsForm.controls['vehicle_model'].valueChanges.pipe(
              startWith(''),
              map((name) => {
                return name ? this.filterMMVPopup(name) : this.modelList;
              })
            );
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
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehcileType}&search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.variantList = res;
          /**
           * when input field value changes than valueChanges is used
           */
          this.filteredPopupVariant = this.vehicleDetailsForm.controls['vehicle_model'].valueChanges.pipe(
            startWith(''),
            map((name) => {
              return name ? this.filterVariantPopup(name) : this.variantList;
            })
          );
        }
      });
  }


  getRTOData(){
    this.apiservice.getRequestedResponse(ApiConstants.get_rto_list).subscribe((res)=>{
      if(res){
         this.rtoList = res;
               /**
           * when input field value changes than valueChanges is used
           */
      this.filteredRtoList = this.vehicleDetailsForm.controls['registration_city'].valueChanges
      .pipe(
        debounceTime(1000),
        startWith(''),
        map(name =>{  
       
        return name ? this.filterRTO(name) : this.rtoList
      }
        )
      );
      }
     
  })
  }

   /**
   * 
   * @param name filterMMV used for filter MMV data
   * @returns 
   */
   filterRTO(name: string) {
    
    return this.apiservice.getRequestedResponse(`${ApiConstants.get_rto_list}?search_element=${name}`).subscribe((res)=>{
      if(res){
        this.rtoList = res;
         /**
         * when input field value changes than valueChanges is used
         */
    this.filteredRtoList = this.vehicleDetailsForm.controls['registration_city'].valueChanges
    .pipe(
      startWith(''),
      map(name =>{  
     
      return name ? this.filterRTO(name) : this.rtoList
    }
      )
    );
      }
     
  })
  }
}
