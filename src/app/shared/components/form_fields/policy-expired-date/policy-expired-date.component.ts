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
  disablEexpiryDate = false;
  @Input() disablePreviousInsurer: any;
  disableExpDateField: any;
  isDatepickerOpen = false;
  proposalUrl:any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // add form control for the Policy Expiry Date
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'policy_expiry_date',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('policy_expiry_date', new FormControl());
    }

    this.sharedDataService.disableInsurer.subscribe((res) => {
      this.disableExpDateField = res;
      if (this.disableExpDateField) {
        this.form.controls['policy_expiry_date'].disable();
      } else {
        this.form.controls['policy_expiry_date'].enable();
      }
    });
    if (this.disablePreviousInsurer) {
      this.form.controls['policy_expiry_date'].disable();
    }
    const currentUrl = this.router.url.split('/');
    this.proposalUrl = currentUrl[currentUrl.length - 1];
  }

  ngOnDestroy(): void {
    // remove form control for the Policy Expiry Date
    this.form.removeControl('policy_expiry_date');
  }
  @ViewChild('datepickerFooter', { static: false })
  datepickerFooter!: ElementRef;
  @ViewChild('expiryDate', { static: false }) expiryDate!: MatDatepicker<any>;
  @ViewChild('policyExpiryDateInput', { static: false })
  policyExpiryDateInput!: ElementRef;

  selectedValue: Date | null = null;

  onOpen() {
    this.appendFooter();
    if(this.proposalUrl === 'proposal'){
      this.isDatepickerOpen = false;
    }else{
    this.isDatepickerOpen = true;
    }
  }

  /**
   * Sets the value of the input element to the previous date and closes the datepicker.
   */
  previousExpiryDate() {
    const inputValue = 'Not Sure';
    this.policyExpiryDateInput.nativeElement.value = inputValue;
    this.expiryDate.close();
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
}
