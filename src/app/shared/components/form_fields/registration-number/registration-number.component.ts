import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  @Input() isRegistrationNumber: any;
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
          this.registrationNumberCheckLength.bind(this),
        ])
      );
    } else {
      this.form.addControl('registration_number', new FormControl());
    }
  }
  inputValue: string = '';
  /**
   * Updates the form validation status based on the input value.
   *
   * @remarks
   * This function sets the form validation status for the registration number input based on the input value. It also sets a session storage variable to indicate whether the form is valid or not.
   *
   * @example
   * ```typescript
   * */
  onInputChange() {
    this.inputValue = this.inputValue;
    sessionStorage.setItem(
      'registration_form_isValid',
      String(this.form.valid)
    );
    if (this.form.get('registration_number')?.value != '') {
      this.form
        .get('registration_number')
        ?.setValidators([
          Validators.required,
          this.registrationNumberCheckLength.bind(this),
        ]);
      this.form.get('registration_number')?.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    // remove form control for the registration number
    this.form.removeControl('registration_number');
  }
  /**
   * Checks the length of the registration number input.
   *
   * @param control - The FormControl to be validated.
   * @returns An object containing the error keys, or null if the input is valid.
   */
  registrationNumberCheckLength(control: FormControl) {
    if (!control.value || typeof control.value !== 'string') {
      return null; // Don't validate if the control is empty or not a string
    }
    const valueToCheck = control.value.replace(/-/g, '');
    const minLength = 8;
    const maxLength = 14;

    if (valueToCheck.length < minLength) {
      return { minlength: true };
    }
    if (valueToCheck.length > maxLength) {
      return { maxlength: true };
    }

    return null;
  }
}
