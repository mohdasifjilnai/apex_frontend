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
      }
    });
    // this.sharedDataService.getErrorProposalDetails.subscribe((errData) => {
    //   if (errData?.detail[0]) {
    //     for (let error of errData?.detail[0]?.loc) {
    //       if (error === 'address_line') {
    //         this.proposalErrorMsg = errData?.detail[0]?.msg;
    //       }
    //     }
    //   }
    // });
    // this.vehilceRegistrationForm
    //   .get('vehicle_registration_address')
    //   ?.valueChanges.subscribe((res) => {
    //     if (res.length === 0) {
    //       this.isNotShowErrorMsg = false;
    //     }
    //   });
  }
}
