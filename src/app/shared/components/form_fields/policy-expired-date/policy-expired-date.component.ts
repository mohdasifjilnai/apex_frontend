import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

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

  constructor(private ctrlContainer: FormGroupDirective) {}

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
  }

  ngOnDestroy(): void {
    // remove form control for the Policy Expiry Date
    this.form.removeControl('policy_expiry_date');
  }
}
