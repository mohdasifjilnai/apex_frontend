import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-registration-date',
  templateUrl: './registration-date.component.html',
  styleUrls: ['./registration-date.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RegistrationDateComponent implements OnInit {
  form!: FormGroup;
  minDate: any;
  maxDate: any;
  @Input('required') isRequired = false;
  @Input() customRegistrationDate!: string;
  @Input() isRegistrationDateDisbaled!: any;
  @ViewChild('registrationDate') registrationDate!: MatDatepicker<Date>;
  @ViewChild('registrationInput') registrationInput!: ElementRef;

  constructor(private ctrlContainer: FormGroupDirective,private sharedDataService:SharedDataService) {
    // this.minDate = new Date(1970, 0);
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 15));
    const currentYear = moment().year();
    /**
     * Set minDate to the first day of January 1990
     */

    this.minDate = moment({ year: currentYear - 20, month: 0 }).startOf(
      'month'
    );
  }

  ngOnInit(): void {
    // add form control for the Registration Date
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'registration_date',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('registration_date', new FormControl());
    }
  }

  ngOnDestroy(): void {
    // remove form control for the Registration Date
    this.form.removeControl('registration_date');
  }
  EnterKey(event: Event) {
    this.sharedDataService.handleEnterKey(event,this.registrationDate)
  }
}
