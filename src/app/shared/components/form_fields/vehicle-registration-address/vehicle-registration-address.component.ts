import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

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
  proposalErrorMsg: any;
  isNotShowErrorMsg: boolean = true;
  maxLength: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the vehicle Communication Addres
     */

    this.vehilceRegistrationForm = this.ctrlContainer.form;
    if (this.isRequired) {
      this.vehilceRegistrationForm.addControl(
        'vehicle_registration_address',
        new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
        ])
      );
    } else {
      this.vehilceRegistrationForm.addControl(
        'vehicle_registration_address',
        new FormControl()
      );
    }
    this.sharedDataService.getErrorProposalDetails.subscribe((errData) => {
      if (errData) {
        this.maxLength = errData?.max_length;
        // this.isNotShowErrorMsg = true;
      }
    });
    this.vehilceRegistrationForm
      .get('vehicle_registration_address')
      ?.valueChanges.subscribe((res) => {
        if (res.length > this.maxLength) {
          this.isNotShowErrorMsg = true;
        } else {
          this.isNotShowErrorMsg = false;
        }
      });
  }
}
