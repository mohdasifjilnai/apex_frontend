import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,

  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class VehicleComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
   /**
    * MMV is use for (Make Model Variant)
    * filteredMMV used for the filter MMV data
    */
  filteredMMV!: Observable<any[]>;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  mmvList:any;
  /**
   * mmv array 
   */
  // mmv: any = [
  //   {
  //     "rb_mmv_id": 8432,
  //     "rb_make_name": "TUNWAL",
  //     "rb_model_name": "LITHINO LI 2.0",
  //     "rb_variant_name": "(28AH) 28AH LEAD ACID BATTERY"
  //   },
  //   {
  //     "rb_mmv_id": 8435,
  //     "rb_make_name": "rr",
  //     "rb_model_name": "MINI LITHINO LI",
  //     "rb_variant_name": "(48V)28AH LEAD ACID BATTERY"
  //   },
  //   {
  //     "rb_mmv_id": 8432,
  //     "rb_make_name": "ee",
  //     "rb_model_name": "LITHINO LI 2.0",
  //     "rb_variant_name": "(28AH) 28AH LEAD ACID BATTERY"
  //   },
  //   {
  //     "rb_mmv_id": 8435,
  //     "rb_make_name": "ww",
  //     "rb_model_name": "MINI LITHINO LI",
  //     "rb_variant_name": "(48V)28AH LEAD ACID BATTERY"
  //   }
  // ];

  constructor(private ctrlContainer: FormGroupDirective,private apiservice:ApiService) {
  
  }

  ngOnInit(): void {
    /**
     * add form control for the vehicle
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'vehicle',
        new FormControl(null, Validators.required),
      );
    } else {
      this.form.addControl('vehicle', new FormControl());
    }

    // if(this.mmvList){
    //   this.form.controls['vehicle'].valueChanges.subscribe((val: any) => {
    //     console.log(val);
        
    // });
    // }
    this.getVehicleMMV('');

    
  }

  /**
   * 
   * @param name filterMMV used for filter MMV data
   * @returns 
   */
  filterMMV(name: string) {
    
    return this.apiservice.getRequestedResponse(`${ApiConstants.get_vehicle_mmv}?product_name=private_car&search_element=${name}`).subscribe((res)=>{
      if(res){
        this.mmvList = res;
        // this.filteredMMV = this.mmvList;
         /**
         * when input field value changes than valueChanges is used
         */
    this.filteredMMV = this.form.controls['vehicle'].valueChanges
    .pipe(
      startWith(''),
      map(name =>{  
     
      return name ? this.filterMMV(name) : this.mmvList
    }
      )
    );
      }
     
  })
  }


  getVehicleMMV(name:any){
    this.apiservice.getRequestedResponse(`${ApiConstants.get_vehicle_mmv}?product_name=private_car`).subscribe((res)=>{
        if(res){
          this.mmvList = res;
          // this.filteredMMV = this.mmvList;
           /**
           * when input field value changes than valueChanges is used
           */
      this.filteredMMV = this.form.controls['vehicle'].valueChanges
      .pipe(
        debounceTime(1000),
        startWith(''),
        map(name =>{  
       
        return name ? this.filterMMV(name) : this.mmvList
      }
        )
      );
        }
       
    })
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the vehicle
     */
    this.form.removeControl('vehicle');
   
  }
}
