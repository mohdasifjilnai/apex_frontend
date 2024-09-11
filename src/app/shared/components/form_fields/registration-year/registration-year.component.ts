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
// import * as _moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Subscription } from 'rxjs';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-registration-year',
  templateUrl: './registration-year.component.html',
  styleUrls: ['./registration-year.component.scss'],
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
export class RegistrationYearComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  minDate: any;
  maxDate: any;
  currentDate: any;
  dateAppointment: any;
  routerEvents: any;
  currentPageUrl: any;
  private registrationDateSubscription!: Subscription;
  @ViewChild('registrationYear') registrationYear!: MatDatepicker<Date>;
  @ViewChild('registrationInput') registrationInput!: ElementRef;
  @Input() urlDate: any;
  registrationDate: any;
  disableFromDate: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private sharedDataService: SharedDataService,
    private router: ActivatedRoute
  ) {}
  ctrlValue: any;
  chosenYearHandler(normalizedYear: Moment) {
    // this.ctrlValue = this.form.controls['registration_date'].value || moment();
    // this.ctrlValue?.year(normalizedYear.year());
    // this.form.controls['registration_date'].setValue(this.ctrlValue);
  }

  // chosenMonthHandler(
  //   normalizedMonth: Moment,
  //   datepicker: MatDatepicker<Moment>
  // ) {
  //   this.ctrlValue = this.form.controls['registration_date'].value || moment();
  //   this.ctrlValue?.month(normalizedMonth.month());
  //   this.ctrlValue?.year(normalizedMonth.year());
  //   this.form.controls['registration_date'].setValue(this.ctrlValue);
  //   this.sharedDataService.registrationYearData(
  //     this.form.controls['registration_date']
  //   );
  //   datepicker.close();
  //   this.onRegistrationDateChange(this.ctrlValue);
  // }
  ngOnInit(): void {
    /**
     * add form control for the Registration Year
     */
    this.form = this.ctrlContainer.form;

    if (this.isRequired) {
      this.form.addControl(
        'registration_date',
        new FormControl('', Validators.required)
      );
    } else {
      this.form.addControl('registration_date', new FormControl());
    }

    // const currentYear = moment().year();
    // const currentMonth = moment().month();

    // // /**
    // //  * Set maxDate to the last day of the current month
    // //  */
    // this.maxDate = moment({ year: currentYear, month: currentMonth }).endOf(
    //   'month'
    // );

    // // /**
    // //  * Set minDate to the first day of January 1990
    // //  */

    // this.minDate = moment({ year: currentYear - 20, month: 0 }).startOf(
    //   'month'
    // );
    // this.form.controls['registration_date'].setValue('');

    // this.maxDate = new Date(new Date().setDate(new Date().getDate() + 10));
    // const currentYear = moment().year();
    // /**
    //  * Set minDate to the first day of January 1990
    //  */

    // // this.minDate = moment({ year: currentYear - 20, month: 0 }).startOf('month');
    // const currentDate = new Date();
    // const minDateOffset = -20;
    // this.minDate = this.getYearDateOffset(currentDate, minDateOffset);

    this.currentDate = new Date();
    this.minDate = new Date(
      this.currentDate.getFullYear() - 20,
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    );
    this.disableFromDate = new Date(this.currentDate);
    this.disableFromDate.setDate(this.disableFromDate.getDate() - 270);
    this.maxDate = new Date(this.currentDate);
    this.maxDate.setDate(this.maxDate.getDate() + 10);

    /**
     * Set up valueChanges subscription
     */
    this.registrationDateSubscription = this.form.controls[
      'registration_date'
    ].valueChanges.subscribe((value: Moment) => {
      /**
       * value' contains the selected date
       */
      /**
       * You can perform any specific action here based on the value change
       */

      if (value != null) {
        if (this.urlDate == 'motor') {
          this.sharedDataService.registrationYearData(
            this.form.controls['registration_date']
          );
          let registrationDate = this.form.controls['registration_date'].value;
          this.sharedDataService.regDateForPolicyExpiry(
            new Date(registrationDate)
          );
        } else {
          this.onRegistrationDateChange(value);
        }
      }
    });

    let renewalType = sessionStorage.getItem('renewalType');
    if (renewalType == 'renewal') {
      // this.form.get('registration_date')?.disable();
    }
  }
  /**
   * for use month selection
   */
  chosenMonthRegistration(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    let registrationDate = this.form.controls['registration_date'].value;
    if (!registrationDate) {
      registrationDate = moment();
    } else {
      registrationDate = moment(registrationDate);
    }
    registrationDate.month(normalizedMonth.month());
    registrationDate?.year(normalizedMonth.year());
    registrationDate?.date(normalizedMonth.date());
    this.form.controls['registration_date'].setValue(registrationDate);
    datepicker?.close();
  }
  ngOnDestroy(): void {
    /**
     * remove form control for the Registration Year
     */
    this.form.removeControl('registration_date');

    // /**
    //  * Unsubscribe from the valueChanges observable to prevent memory leaks
    //  */
    // if (this.registrationDateSubscription) {
    //   this.registrationDateSubscription.unsubscribe();
    // }
  }

  /**
   * Function to handle the value change
   */
  onRegistrationDateChange(value: Moment): void {
    /**
     * Perform specific action based on the value change
     */
    this.sharedDataService.getRegistrationDate(value);
  }
  EnterKey(event: Event) {
    this.sharedDataService.handleEnterKey(event, this.registrationYear);
  }
  /**
   *
   * @param date current date
   * @param offset minimum date
   * this function used for the year validation in registartion date
   */
  getYearDateOffset(date: Date, offset: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + offset);
    return result;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const dayBeforeCurrDate = new Date(this.currentDate);
    dayBeforeCurrDate.setDate(this.currentDate.getDate() - 1);
    // Disable dates from 270 days ago to today
    return date < this.disableFromDate || date >= dayBeforeCurrDate;
    //return date < this.disableFromDate || date > this.currDate;
  };

  registrationDateSelected(date: any) {
    // let registrationDate = this.form.controls['registration_date'].value;
    // if (this.urlDate == 'motor') {
    //   this.sharedDataService.registrationYearData(
    //     this.form.controls['registration_date']
    //   );
    // } else {
    //   this.onRegistrationDateChange(registrationDate);
    // }
  }
}
