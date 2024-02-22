import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-owner-details',
  templateUrl: './vehicle-owner-details.component.html',
  styleUrls: ['./vehicle-owner-details.component.scss'],
})
export class VehicleOwnerDetailsComponent implements OnInit {
  @Output() afterFormSubmit = new EventEmitter<any>();
  occupationList: any;
  maritalStatusList: any;
  filteredPincodeList!: Observable<any[]>;
  @Output() afterVehicleOwnerData = new EventEmitter<any>();
  @Input() fetchCkycData: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  owenerVehicleDetailsForm: FormGroup = new FormGroup({
    owner_full_Name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
    owner_email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^.+@.+[.].+$/),
    ]),
    contact_number: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/),
    ]),
    owner_gstin: new FormControl('', [
      Validators.required,
      Validators.pattern(
        new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
      ),
    ]),
    additional_contact: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/),
    ]),
    
    owner_pincode: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    owner_city: new FormControl('', Validators.required),
    owner_state: new FormControl('', Validators.required),
    ownner_occupation_type: new FormControl('', Validators.required),
    owner_communication_addres: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]+$/),
    ]),
    marital_status: new FormControl('1', Validators.required),
    gender: new FormControl('1', Validators.required),
  });

  constructor() {
    this.occupationList = [
      {
        id: 1,
        occupationName: 'Software Developer',
      },
    ];

    this.maritalStatusList = [
      {
        id: 1,
        name: 'Single',
      },
      {
        id: 2,
        name: 'Married',
      },
    ];
  }

  ngOnInit(): void {
  }
  getVehicleDetails(isValid: any) {
    if (isValid) {
      const formValues = this.owenerVehicleDetailsForm.value;
      this.afterVehicleOwnerData.emit(formValues);
    }
  }
  submitFormGroup() {
    this.afterFormSubmit.emit('Vehicle-owner-details Form Submited');
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9@]/g, '');
  }
}
