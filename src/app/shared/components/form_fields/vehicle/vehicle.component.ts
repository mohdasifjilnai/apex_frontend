import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  Subject,
  debounceTime,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
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
  filteredMMV!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  mmvList: any;
  vehcileType = 'private_car';
  mmvDataNotAvailable = '';
  // vehicle = new FormControl();
  mmvListValue: any;
  mmvId: any;
  private debounceSubjectVehcileMMV = new Subject<any>();
  vehicleSelectedData: any;
  showSelectedFuelandCapacity: boolean = false;
  vehicleSearchDataLength: any;
  @Output() responseEvent = new EventEmitter<string>();

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

    this.sharedata.getSelectedvehicle.subscribe((res) => {
      this.vehcileType = res;
      // this.getVehicleMMV('', this.vehcileType);
    });
    this.debounceSubjectVehcileMMV
      .pipe(
        debounceTime(300) // Adjust the debounce time as needed (in milliseconds)
      )
      .subscribe((data: any) => {
        if (data?.length >= 3) {
          this.getVehicleMMV(data, this.vehcileType);
        }
      });

    // this.getVehicleMMV('', this.vehcileType);
  }
  sendResponse(response: string) {
    if (response != null) {
      this.responseEvent.emit(response);
    } else {
      this.showSelectedFuelandCapacity = false;
    }
  }
  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterMMV(name: string, newRes: any) {
    if (typeof name != 'object') {
      if (name.length > 2) {
        if (newRes && newRes.length > 0) {
          this.mmvList = newRes.map((item: any) => ({
            ...item,
            displayMMV: `${item.rb_make_name} | ${item.rb_model_name} | ${item.rb_variant_name}`,
          }));
          this.mmvDataNotAvailable = '';
        } else {
          this.mmvDataNotAvailable = 'No result found';
          return of([this.mmvDataNotAvailable]);
        }
        return of(this.mmvList);
      }
    }
    return of([]);
  }
  vehcileMMV(data: any) {
    this.sendResponse(data);
    this.vehicleSearchDataLength = data.length;
    this.showSelectedFuelandCapacity = false;
    if (data?.fuel) {
      this.showSelectedFuelandCapacity = true;
      this.vehicleSelectedData = data;
    }
    this.debounceSubjectVehcileMMV.next(data);
  }

  getVehicleMMV(name: any, vehicletype: any) {
    let vehicleType = localStorage.getItem('vehicleType');
    this.apiservice
      .getRequestedResponse(
        `${
          ApiConstants.get_vehicle_mmv
        }?product_name=${vehicleType}&search_element=${name
          .replace(/\|/g, '')
          .replace(/\s+/g, ' ')
          .trim()}`
      )
      .subscribe(
        (res) => {
          if (res) {
            if (!res.message) {
              this.mmvList = res.map((item: any) => ({
                ...item,
                displayMMV: `${item.rb_make_name} | ${item.rb_model_name} | ${item.rb_variant_name}`,
              }));
            }

            this.mmvDataNotAvailable = res.length > 0 ? '' : res.message;
            this.filteredMMV = this.form.controls['vehicle'].valueChanges.pipe(
              debounceTime(500),
              startWith(name),
              switchMap((name: any) => this.filterMMV(name, res))
            );
          }
        },
        (error) => {
          this.showSelectedFuelandCapacity = false;
        }
      );
    this.sendResponse(this.mmvDataNotAvailable);
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the vehicle
     */
    this.form.removeControl('vehicle');
  }

  displayVehicle(data?: any) {
    if (data != null && data != 'No result found') {
      this.mmvId = data.rb_mmv_id;
      return data ? data.displayMMV : undefined;
    }
  }
}
