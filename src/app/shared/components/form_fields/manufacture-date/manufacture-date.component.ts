import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() isManufactureDateDisbaled!: any;
  manufactureDate: any;
  @ViewChild('manufactureDates') manufactureDates!: MatDatepicker<Date>;
  @ViewChild('manufactureInput') manufactureInput!: ElementRef;
  minDate: any;
  maxDate: any;
  maxManufactureDate!: Date;
  constructor(
    private ctrlContainer: FormGroupDirective,
    private shared: SharedDataService
  ) {
    const currentDate = new Date();

    /**
     * Set the minDate to 15 years before the current date
     */
    this.minDate = new Date(
      currentDate.getFullYear() - 15,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    /**
     * Use the existing maxDate initialization
     */
    this.maxDate = new Date(new Date().setDate(currentDate.getDate() + 15));

    /**
     * Subscribe to the shared observable to get the manufacturing date
     */
    this.shared.getRegistrationData.subscribe((res) => {
      /**
       * Set the maxManufactureDate based on the received response
       */
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
      this.form.addControl('manufacture_date', new FormControl(null));
    }
    // this.form.controls['manufacture_date'].setValue(null);
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
    this.manufactureDate.month(normalizedMonth.month());
    this.manufactureDate?.year(normalizedMonth.year());
    this.form.controls['manufacture_date'].setValue(this.manufactureDate);
    datepicker.close();
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Manufacture Date
     */
    this.form.removeControl('manufacture_date');
  }
  EnterKey(event: Event, manufacture: MatDatepicker<Date>) {
    this.shared.handleEnterKey(event, manufacture);
  }
}
