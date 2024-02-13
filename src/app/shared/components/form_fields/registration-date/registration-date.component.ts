import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

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
  @Input('required') isRequired = false;
  @Input() customRegistrationDate!:string
  
  constructor(private ctrlContainer: FormGroupDirective) {}

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
}
