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
import { SharedDataService } from 'src/app/core/services/shared-data.service';

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
  mmvList: any;
  vehcileType = 'private_car';

  constructor(
    private ctrlContainer: FormGroupDirective,
    private apiservice: ApiService,
    private sharedata: SharedDataService
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the vehicle
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'vehicle',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('vehicle', new FormControl());
    }

    // if(this.mmvList){
    //   this.form.controls['vehicle'].valueChanges.subscribe((val: any) => {
    //     console.log(val);

    // });
    // }

    this.sharedata.getSelectedvehicle.subscribe((res) => {
      this.vehcileType = res;
      this.getVehicleMMV('', this.vehcileType);
    });

    this.getVehicleMMV('', this.vehcileType);
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterMMV(name: string) {
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehcileType}&search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.mmvList = res;
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
          this.filteredMMV = this.form.controls['vehicle'].valueChanges.pipe(
            startWith(''),
            map((name) => {
              return name ? this.filterMMV(name) : this.mmvList;
            })
          );
        }
      });
  }

  getVehicleMMV(name: any, vehicletype: any) {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_vehicle_mmv}?product_name=${this.vehcileType}`
      )
      .subscribe((res) => {
        if (res) {
          this.mmvList = res;
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
          this.filteredMMV = this.form.controls['vehicle'].valueChanges.pipe(
            debounceTime(1000),
            startWith(''),
            map((name) => {
              return name ? this.filterMMV(name) : this.mmvList;
            })
          );
        }
      });
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the vehicle
     */
    this.form.removeControl('vehicle');
  }
}
