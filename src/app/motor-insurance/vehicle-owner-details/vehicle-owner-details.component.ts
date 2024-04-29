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
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

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
  salutationList: any;
  ckycItem: any;
  vehicleOwnerName: boolean = false;
  proposalData: any;
  quoteData: any;
  pincodeId: any;
  proposalType: any;
  proposalBaseOwner: any;
  proposerType: any;
  isProposerTrue: boolean = true;

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
      Validators.pattern(
        new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
      ),
    ]),
    additional_contact: new FormControl('', [
      Validators.pattern(/^[6-9]\d{9}$/),
    ]),

    owner_pincode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      this.pincodeNumberValidator.bind(this),
    ]),
    owner_city: new FormControl('', Validators.required),
    owner_state: new FormControl('', Validators.required),
    ownner_occupation_type: new FormControl(''),
    owner_communication_addres: new FormControl('', [Validators.required]),
    marital_status: new FormControl('1', Validators.required),
    owner_gender: new FormControl(''),
    ownner_salutation_type: new FormControl('', Validators.required),
  });

  constructor(
    private sharedDataService: SharedDataService,
    private apiService: ApiService
  ) {
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
    this.quoteData = sessionStorage.getItem('quotes_data');
    this.proposerType = sessionStorage.getItem('proposerType');
    this.proposerType == 'individual'
      ? (this.isProposerTrue = true)
      : (this.isProposerTrue = false);
    this.sharedDataService.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (proposal?.customer_details !== null) {
        this.owenerVehicleDetailsForm.patchValue({
          owner_full_Name: proposal?.customer_details?.full_name,
          owner_email: proposal?.customer_details?.email_id,
          contact_number: proposal?.customer_details?.mobile_number,
          owner_gstin: proposal?.customer_details?.gst_no,
          additional_contact:
            proposal?.customer_details?.additional_mobile_number,
          ownner_occupation_type:
            proposal?.customer_details?.occupation_type_id,
          owner_communication_addres:
            proposal?.customer_details?.communication_address?.address_line,
          marital_status: proposal?.customer_details?.marital_status,
          owner_gender: proposal?.customer_details?.gender,
          ownner_salutation_type: proposal?.customer_details?.salutation,
        });
        if (
          this.proposalData?.customer_details?.communication_address?.pincode
        ) {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${
                this.proposalData?.customer_details?.communication_address
                  ?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
            )
            .subscribe((res) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: res[0],
                owner_city: res[0].rb_city_name,
                owner_state: res[0].rb_state_name,
              });
            });
        }
      }
    });
    this.sharedDataService.fetchedCkycData.subscribe((ckycData) => {
      if (ckycData?.ckycData?.customer_details?.full_name) {
        this.vehicleOwnerName = true;
      }
      if (ckycData) {
        if (ckycData?.customer_details?.pincode) {
          this.apiService
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${
                ckycData?.customer_details?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
            )
            .subscribe((res) => {
              this.owenerVehicleDetailsForm.patchValue({
                owner_pincode: res[0],
                owner_city: res[0].rb_city_name,
                owner_state: res[0].rb_state_name,
              });
            });
        }

        this.owenerVehicleDetailsForm.patchValue({
          owner_full_Name: ckycData?.customer_details?.full_name,
          owner_email: ckycData?.customer_details?.email,
          contact_number: ckycData?.customer_details?.mobile_number,
          owner_communication_addres: ckycData?.customer_details?.address,
          owner_city: ckycData?.customer_details?.rb_city_name,
          owner_state: ckycData?.customer_details?.rb_state_name,
        });
      }
    });
    this.sharedDataService.getErrorProposalDetails.subscribe((errData) => {
      if (errData?.detail[0]) {
        for (let error of errData?.detail[0]?.loc) {
          if (error === 'address_line') {
            this.owenerVehicleDetailsForm.controls[
              'owner_communication_addres'
            ].setErrors({ pattern: true });
          }
        }
      }
    });
    this.owenerVehicleDetailsForm
      .get('owner_pincode')
      ?.valueChanges.subscribe((pincode) => {
        if (pincode.length === 0) {
          this.owenerVehicleDetailsForm.patchValue({
            owner_city: '',
            owner_state: '',
          });
        }
      });
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (kycData?.customer_details) {
      if (kycData?.customer_details?.full_name) {
        this.vehicleOwnerName = true;
      }
      this.owenerVehicleDetailsForm.patchValue({
        owner_full_Name: kycData?.customer_details?.full_name,
        owner_email: kycData?.customer_details?.email,
        contact_number: kycData?.customer_details?.mobile_number,
        owner_communication_addres: kycData?.customer_details?.address,
        owner_city: kycData?.customer_details?.rb_city_name,
        owner_state: kycData?.customer_details?.rb_state_name,
      });
    }
    this.getOccupationType();
    this.getPincodeList();
    this.getSalutationType();

    let renewalType = sessionStorage.getItem('renewalType');
    if (renewalType == 'renewal') {
      this.owenerVehicleDetailsForm?.disable();
    }
    this.proposalType = sessionStorage.getItem('proposerType');
    if (this.proposalType == 'individual') {
      this.proposalBaseOwner = 'Owner Full Name';

      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.setValidators([Validators.required]);
      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.updateValueAndValidity();
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.setValidators([Validators.required]);
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.updateValueAndValidity();
    } else {
      this.proposalBaseOwner = 'Company Name';
      this.owenerVehicleDetailsForm.get('owner_gender')?.setValidators([]);
      this.owenerVehicleDetailsForm
        .get('owner_gender')
        ?.updateValueAndValidity();
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.setValidators([]);
      this.owenerVehicleDetailsForm
        .get('ownner_occupation_type')
        ?.updateValueAndValidity();
    }
    setTimeout(() => {
      this.sharedDataService.formCheck(this.owenerVehicleDetailsForm.valid);
    }, 2000);
  }
  getVehicleDetails(isValid: any) {
    if (isValid) {
      const formValues = this.owenerVehicleDetailsForm.value;
      this.afterVehicleOwnerData.emit(formValues);
      setTimeout(() => {
        this.sharedDataService.formCheck(this.owenerVehicleDetailsForm.valid);
      }, 2000);
      this.sharedDataService?.createProposalId(
        'vehicle_owner_detail',
        this.owenerVehicleDetailsForm
      );
    }
  }
  /**
   * Emits an event indicating that the form group has been submitted.
   */
  submitFormGroup() {
    this.afterFormSubmit.emit('Vehicle-owner-details Form Submited');
  }

  /**
   * Fetches the list of occupation types from the backend API and stores it in the component's state.
   */
  getOccupationType() {
    this.apiService
      .getRequestedResponse(ApiConstants.occupation_type)
      .subscribe((occupation) => {
        this.occupationList = occupation;
      });
  }
  /**
   * Updates the form with the pincode data
   * @param pincodeData the pincode data
   */
  getSepratedPincodeData(pincodeData: any) {
    if (pincodeData) {
      this.owenerVehicleDetailsForm.patchValue({
        owner_city: pincodeData.rb_city_name,
        owner_state: pincodeData.rb_state_name,
      });
    }
  }

  getPincodeList() {
    const ownerPincodeControl =
      this.owenerVehicleDetailsForm.get('owner_pincode');

    if (ownerPincodeControl) {
      /**
       * Check if ownerPincodeControl is not null
       */
      this.filteredPincodeList = ownerPincodeControl.valueChanges.pipe(
        debounceTime(300), // Debounce for 300 milliseconds
        distinctUntilChanged(),
        switchMap((value) => {
          /**
           * Check if at least 3 characters are entered
           */
          if (value && value.length >= 3) {
            /**
             * Make API call with the entered value
             */
            return this.apiService.getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${value}&insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }`
            );
          } else {
            /**
             * If less than 3 characters, return an empty array
             */
            return of([]);
          }
        })
      );
    }
  }
  getSalutationType() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.salutation}?insurer_code=${
          JSON.parse(this.quoteData)['insurer_code']
        }&is_individual=${this.isProposerTrue}&is_corporate=${!this
          .isProposerTrue}`
      )
      .subscribe((salutation) => {
        this.salutationList = salutation;
      });
  }
  onEnterKeyPressedForPincode() {
    const vehiclePincodeControl =
      this.owenerVehicleDetailsForm.get('owner_pincode');
    if (vehiclePincodeControl && vehiclePincodeControl.valid) {
      const enteredPincode = vehiclePincodeControl.value;
      this.getSepratedPincodeData(enteredPincode);
    }
  }
  displayPincode(data?: any) {
    if (data != null && data != 'No result found') {
      this.pincodeId = data.rb_pincode;

      return data ? data.rb_pincode : undefined;
    }
  }
  /**
   * Checks the length of a pincode and ensures it meets the minimum length requirement.
   *
   * @param control - The FormControl to be validated.
   * @returns An object containing any validation errors or null if the control is valid.
   */
  pincodeNumberValidator(control: FormControl) {
    if (typeof control.value != 'object' && control.value.length >= 6) {
      return { validPincode: true };
    }
    return null;
  }
  /**
   * Checks the validity of the GSTIN entered by the user.
   *
   * @param event - The value of the GSTIN entered by the user.
   */
  checkValidGSTIN(event: any) {
    if (
      this.proposalData?.ckyc_details?.document_type == 'pan_number' &&
      event.length >= 15
    ) {
      let stringWithoutFirstTwo = event.substring(2);
      let stringWithoutLastThree = stringWithoutFirstTwo.slice(0, -3);
      if (
        stringWithoutLastThree.toUpperCase() ==
        this.proposalData?.ckyc_details?.document_number
      ) {
        this.owenerVehicleDetailsForm.get('owner_gstin')?.setErrors(null);
      } else {
        this.owenerVehicleDetailsForm
          .get('owner_gstin')
          ?.setErrors({ validGSTNumber: true });
      }
    }
  }
}
