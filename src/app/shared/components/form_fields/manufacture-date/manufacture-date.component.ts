import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manufacture-date',
  templateUrl: './manufacture-date.component.html',
  styleUrls: ['./manufacture-date.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ManufactureDateComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() customManufactureDate!: string;
  manufactureDate: any;
  minDate: any;
  maxDate: any;
  maxManufactureDate!: Date;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private shared: SharedDataService
  ) {
    this.minDate = new Date(1970, 0);
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 15));
    this.shared.getRegistrationData.subscribe((res) => {
      this.maxManufactureDate = new Date(res);
    });
  }

  ngOnInit(): void {
    /**
     * add form control for the Manufacture Date
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'manufacture_date',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('manufacture_date', new FormControl(moment()));
    }
    this.form.controls['manufacture_date'].setValue(null);
  }

  /**
   * for use year selection
   */
  chosenYearManufacture(normalizedYear: Moment) {
    this.manufactureDate =
      this.form.controls['manufacture_date'].value || moment(); // Set to the current date if null
    this.manufactureDate.year(normalizedYear.year());
    this.form.controls['manufacture_date'].setValue(this.manufactureDate);
  }
  /**
   * for use month selection
   */
  chosenMonthManufacture(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    this.manufactureDate = this.form.controls['manufacture_date'].value;
    this.manufactureDate.month(normalizedMonth.month());
    this.form.controls['manufacture_date'].setValue(this.manufactureDate);
    datepicker.close();
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Manufacture Date
     */
    this.form.removeControl('manufacture_date');
  }
}
