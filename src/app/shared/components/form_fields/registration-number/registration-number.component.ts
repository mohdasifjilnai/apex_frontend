import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-registration-number',
  templateUrl: './registration-number.component.html',
  styleUrls: ['./registration-number.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RegistrationNumberComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() registrationNumber!: string;
  vehicleNotFound: any;
  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    // add form control for the registration number
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'registration_number',
        new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(11),
        ])
      );
    } else {
      this.form.addControl('registration_number', new FormControl());
    }
  }
  inputValue: string = '';

  onInputChange() {
    // Convert input value to uppercase
    this.inputValue = this.inputValue.toUpperCase();
  }

  // Validators.pattern(new RegExp('/^[ A-Za-z0-9-]*$/'))

  ngOnDestroy(): void {
    // remove form control for the registration number
    this.form.removeControl('registration_number');
  }
}
