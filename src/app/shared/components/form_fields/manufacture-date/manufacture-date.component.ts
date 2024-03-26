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
  registrationNumber: any;
  registrationDate: any;
  vehicleMMVData: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private shared: SharedDataService
  ) {}

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
    this.vehicleMMVData = JSON.parse(
      sessionStorage.getItem('vehicleMMVData') || '{}'
    );
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    this.manufactureDateValidation();
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

  /**
   * Manufacture date validation
   *
   * This function sets the minimum and maximum dates for the manufacture date based on the vehicle registration number.
   * If the registration number is null, the minimum date is set 15 years in the past, and the maximum date is set to the current date.
   * If the registration number starts with a letter, the minimum date is set 15 years in the past, and the maximum date is set 15 years in the future.
   * If the registration number starts with a number, the minimum date is set 3 years in the past, and the maximum date is set 15 years in the future.
   * The maximum manufacture date is also set to the latest of the current date or the registration date.
   */
  manufactureDateValidation() {
    this.shared.getRegistrationData.subscribe((data) => {
      this.registrationDate = new Date(data);

      if (this.registrationNumber === null) {
        this.setMinMaxDates(15);
      } else if (/^[A-Za-z]/.test(this.registrationNumber)) {
        this.setMinMaxDates(15);
      } else if (/^[0-9]/.test(this.registrationNumber)) {
        this.setMinMaxDates(3);
      }
    });
  }

  /**
   * Manufacture date validation
   *
   * This function sets the minimum and maximum dates for the manufacture date based on the vehicle registration number.
   * If the registration number is null, the minimum date is set 15 years in the past, and the maximum date is set to the current date.
   * If the registration number starts with a letter, the minimum date is set 15 years in the past, and the maximum date is set 15 years in the future.
   * If the registration number starts with a number, the minimum date is set 3 years in the past, and the maximum date is set 15 years in the future.
   * The maximum manufacture date is also set to the latest of the current date or the registration date.
   *
   * @param yearsToAdd - The number of years to add to the minimum and maximum dates
   */

  setMinMaxDates(yearsToAdd: any) {
    if (this.vehicleMMVData?.registration_date) {
      const registrationDate = new Date(this.vehicleMMVData?.registration_date);
      this.minDate = new Date(
        registrationDate.getFullYear() - yearsToAdd,
        registrationDate.getMonth(),
        registrationDate.getDate()
      );
      this.maxDate = new Date(
        new Date().setDate(registrationDate.getDate() + 15)
      );
      this.shared.getRegistrationData.subscribe((res) => {
        this.maxManufactureDate = new Date(res);
      });
    } else if (this.registrationDate) {
      const registrationDate = new Date(this.registrationDate);
      this.minDate = new Date(
        registrationDate.getFullYear() - yearsToAdd,
        registrationDate.getMonth(),
        registrationDate.getDate()
      );
      this.maxDate = new Date(
        new Date().setDate(registrationDate.getDate() + 15)
      );
      this.shared.getRegistrationData.subscribe((res) => {
        this.maxManufactureDate = new Date(res);
      });
    }
  }
}
