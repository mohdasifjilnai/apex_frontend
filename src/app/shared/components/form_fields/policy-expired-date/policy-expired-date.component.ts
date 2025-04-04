import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-policy-expired-date',
  templateUrl: './policy-expired-date.component.html',
  styleUrls: ['./policy-expired-date.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class PolicyExpiredDateComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() policyExpiryDate!: string;
  @Input() isExpiryDateDisbaled: any;
  disablEexpiryDate = false;
  @Input() disablePreviousInsurer: any;
  @Input() formControlNameData: any;
  disableExpDateField: any;
  isDatepickerOpen = false;
  proposalUrl: any;
  minDate!: Date;
  maxDate!: Date;
  @ViewChild('registrationInput') registrationInput!: ElementRef;
  policyExpiryDateSubscription: any;
  regDateValue: any;
  renewalType:any;
  @Input() urlDate: any;
  visuallyDisabledFields: any =  false;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private sharedDataService: SharedDataService,
    private router: Router,
    private shareDataService:SharedDataService
  ) {}

  ngOnInit(): void {
    // add form control for the Policy Expiry Date
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        this.formControlNameData,
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl(this.formControlNameData, new FormControl());
    }

    this.sharedDataService.disableInsurer.subscribe((res) => {
      this.disableExpDateField = res;
      this.form.patchValue({
        policy_expiry_date: '',
      });
      if (this.disableExpDateField) {
        this.form.controls[this.formControlNameData]?.disable();
      } else {
        this.form.controls[this.formControlNameData]?.enable();
      }
    });
    if (this.disablePreviousInsurer) {
      this.form.controls[this.formControlNameData].disable();
    }
    const currentUrl = this.router.url.split('/');
    this.proposalUrl = currentUrl[currentUrl.length - 2];
    this.sharedDataService.getRegistrationData.subscribe((res) => {
      if (res) {
        this.regDateValue = new Date(res);
        const minDateYear = this.regDateValue.getFullYear();
        const minDateMonth = this.regDateValue.getMonth() - 6;
        this.minDate = new Date(minDateYear, minDateMonth);
      }
    });
    this.sharedDataService.sendRegDatePolicyExpiry.subscribe((res) => {
      if (res) {
        this.regDateValue = res;
        const minDateYear = this.regDateValue.getFullYear();
        const minDateMonth = this.regDateValue.getMonth() - 6;
        this.minDate = new Date(minDateYear, minDateMonth);
      }
    });
    this.renewalType = sessionStorage.getItem('renewalType');
    const previousInsurer = sessionStorage.getItem('previousInsurer');
    if(this.renewalType == 'renewal'){
      this.isExpiryDateDisbaled=false
    }
    if((this.renewalType === 'rollover' || this.renewalType == 'renewal') && (previousInsurer == 'digit' || previousInsurer == 'hdfc_ergo')){
      const currentDate = new Date();
      const minDateOffset = -1; // Subtract 20 years from current date
      const maxDateOffset = 91; //add days to current date
      this.maxDate = this.getDateOffset(currentDate, maxDateOffset);
    }else {
      const currentDate = new Date();
      const minDateOffset = -1; // Subtract 20 years from current date
      const maxDateOffset = 60;
      this.maxDate = this.getDateOffset(currentDate, maxDateOffset);
    }

    // this.visuallyDisabledFields = this.shareDataService.disableVisually(['policy_expiry_date'], this.form);    
  }

  ngOnDestroy(): void {
    // remove form control for the Policy Expiry Date
    this.form.removeControl(this.formControlNameData);
  }
  @ViewChild('datepickerFooter', { static: false })
  datepickerFooter!: ElementRef;
  @ViewChild('expiryDate', { static: false }) expiryDate!: MatDatepicker<any>;
  @ViewChild('policyExpiryDateInput', { static: false })
  policyExpiryDateInput!: ElementRef;

  selectedValue: Date | null = null;

  onOpen() {
    this.appendFooter();
    if (this.proposalUrl === 'proposal') {
      this.isDatepickerOpen = false;
    } else {
      this.isDatepickerOpen = true;
    }
  }

  /**
   * Sets the value of the input element to the previous date and closes the datepicker.
   */
  previousExpiryDate() {
    const inputValue = 'Not Sure';
    this.form.get('policy_expiry_date')?.setValue(inputValue);
    this.form.get('policy_expiry_date')?.clearValidators();
    this.form.get('policy_expiry_date')?.updateValueAndValidity();
    this.policyExpiryDateInput.nativeElement.value = inputValue;
    this.expiryDate.close();
    const previousInsurerControl = this.form.get('previous_insurer');
    if (previousInsurerControl) {
      previousInsurerControl.clearValidators();
      previousInsurerControl.updateValueAndValidity();
    }
  }

  /**
   * Appends the datepicker footer to the calendar view.
   */

  appendFooter() {
    const matCalendar = document.getElementsByClassName(
      'mat-datepicker-content'
    )[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
  }

  /**
   * Returns a new Date that is the specified number of days after the specified date.
   * @param date The date to add days to.
   */
  getDateOffset(date: Date, offset: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + offset);
    return result;
  }
  /**
   * Returns a new Date that is the specified number of years after the specified date.
   * @param date The date to add years to.
   * @param offset The number of years to add.
   */
  getYearDateOffset(date: Date, offset: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + offset);
    return result;
  }
  EnterKey(event: Event) {
    this.sharedDataService.handleEnterKey(event, this.expiryDate);
  }

  onExpiryDate(date: any) {
    this.sharedDataService.policyExpiryDate(date);
  }
}
