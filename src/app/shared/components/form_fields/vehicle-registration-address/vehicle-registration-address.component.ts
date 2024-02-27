import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-vehicle-registration-address',
  templateUrl: './vehicle-registration-address.component.html',
  styleUrls: ['./vehicle-registration-address.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class VehicleRegistrationAddressComponent implements OnInit {
  vehilceRegistrationForm!: FormGroup;
  @Input('required') isRequired = false;

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    /**
     * add form control for the vehicle Communication Addres
     */

    this.vehilceRegistrationForm = this.ctrlContainer.form;
    if (this.isRequired) {
      this.vehilceRegistrationForm.addControl(
        'vehicle_registration_addres',
        new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
        ])
      );
    } else {
      this.vehilceRegistrationForm.addControl(
        'vehicle_registration_addres',
        new FormControl()
      );
    }
  }
}
