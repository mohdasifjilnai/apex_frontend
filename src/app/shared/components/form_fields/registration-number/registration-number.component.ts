import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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
  
  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    // add form control for the registration number
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'registration_number',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('registration_number', new FormControl());
    }
  }

  ngOnDestroy(): void {
     // remove form control for the registration number
    this.form.removeControl('registration_number');
  }

}
