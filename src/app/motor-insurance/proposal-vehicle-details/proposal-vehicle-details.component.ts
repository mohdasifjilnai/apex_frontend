import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-proposal-vehicle-details',
  templateUrl: './proposal-vehicle-details.component.html',
  styleUrls: ['./proposal-vehicle-details.component.scss'],
})
export class ProposalVehicleDetailsComponent implements OnInit {
  filteredPincodeList!: Observable<any[]>;
  agreementList: any;
  filteredFinancierList!: any;
  financerList: any;
  transactionId: any;
  proposalData: any;
  financierId: any;
  pinocodeId: any;
  private proposalDetailsSubscription!: Subscription;
  @Input() fetchNomineeDetails: any;
  @Output() afterVehicleData = new EventEmitter<any>();
  @ViewChild('financedToggle', { static: false }) financedToggle!: ElementRef;
  @ViewChild('registrationAddressToggle', { static: false })
  registrationAddressToggle!: ElementRef;
  isManufactureDateDisbaled: boolean = false;
  isRegistrationDateDisbaled: boolean = false;
  isRegistrationNumber: boolean = false;
  quoteData: any;
  proposalVehilceDetailsForm: FormGroup = new FormGroup({
    registration_number: new FormControl(''),
    vehicle_colour: new FormControl(''),
    engine_number: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]+$/),
    ]),
    chassis_number: new FormControl('', [
      Validators.required,
      Validators.pattern(
        new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$')
      ),
      Validators.minLength(17),
      Validators.maxLength(25),
    ]),
    registration_date: new FormControl('', Validators.required),
    manufacture_date: new FormControl('', Validators.required),
    vehicle_pincode: new FormControl('', Validators.required),
    vehilce_city: new FormControl('', Validators.required),
    vehicle_state: new FormControl('', Validators.required),
    financer: new FormControl(''),
    agreement_type: new FormControl(''),
    financer_city: new FormControl(''),
    is_financed: new FormControl(''),
    vehicle_registration_address: new FormControl('', Validators.required),
    is_vehicle_address: new FormControl(''),
  });
  isChecked: any;
  isFinancedChecked: any;
  vehicleType: any;
  pincodeData: any;
  mmvData: any;

  constructor(
    private apiservice: ApiService,
    private shareData: SharedDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quoteData = sessionStorage.getItem('quotes_data');

    this.mmvData = sessionStorage.getItem('mmv_data');
    const mmvItem = JSON.parse(this.mmvData);
    if (mmvItem) {
      if (mmvItem?.manufacture_date) {
        this.isManufactureDateDisbaled = true;
      }
      if (mmvItem?.registration_date) {
        this.isRegistrationDateDisbaled = true;
      }
      this.proposalVehilceDetailsForm.patchValue({
        registration_date: mmvItem?.registration_date,
        manufacture_date: mmvItem?.manufacture_date,
      });
    }
    this.shareData.getProposalDetails.subscribe((proposal) => {
      if (proposal?.vehicle_details !== null) {
        const proposalParam = sessionStorage.getItem('proposal_param');
        if (proposalParam && proposalParam === 'true') {
          this.proposalVehilceDetailsForm.patchValue({
            registration_date: moment(
              proposal?.vehicle_details?.registration_date,
              'DD/MM/YYYY'
            ).toDate(),
            manufacture_date: moment(
              proposal?.vehicle_details?.manufacture_date,
              'DD/MM/YYYY'
            ).toDate(),
          });
        }
        if (proposal.vehicle_details?.is_same_location) {
          this.getRegistrationAddressValue(
            proposal.vehicle_details?.is_same_location
          );
        } else {
          this.getRegistrationAddressValue(
            proposal.vehicle_details?.is_same_location
          );
        }
        // this.getRegistrationAddressValue();
        this.proposalData = proposal;
        if (this.proposalData?.vehicle_details?.financer_details?.financer_id) {
          this.apiservice
            .getRequestedResponse(
              `${ApiConstants.financier_List}?insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }&financier_id=${
                this.proposalData?.vehicle_details?.financer_details
                  ?.financer_id
              }`
            )
            .subscribe((response) => {
              this.proposalVehilceDetailsForm.patchValue({
                financer: response[0],
              });
            });
        }
        this.proposalVehilceDetailsForm.patchValue({
          registration_number: proposal?.vehicle_details?.registration_no,
          vehicle_colour: proposal?.vehicle_details?.vehicle_color,
          engine_number: proposal?.vehicle_details?.engine_no,
          chassis_number: proposal?.vehicle_details?.chassis_no,

          vehicle_pincode:
            proposal?.vehicle_details?.registration_address?.pincode,
          financer: proposal?.vehicle_details?.financer_details?.financer_id,
          agreement_type:
            proposal?.vehicle_details?.financer_details?.agreement_type,
          financer_city:
            proposal?.vehicle_details?.financer_details?.financer_branch,
          is_financed: proposal?.vehicle_details?.is_vehicle_financed,
          vehicle_registration_address:
            proposal?.vehicle_details?.registration_address?.address_line,
          is_vehicle_address: proposal?.vehicle_details?.is_same_location,
        });
        if (this.proposalData?.vehicle_details?.registration_address?.pincode) {
          this.apiservice
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${this.proposalData?.vehicle_details?.registration_address?.pincode}`
            )
            .subscribe((res) => {
              if (!this.proposalVehilceDetailsForm.get('vehicle_state')) {
                this.proposalVehilceDetailsForm.addControl(
                  'vehicle_state',
                  new FormControl('')
                );
              }
              this.proposalVehilceDetailsForm.patchValue({
                vehicle_pincode: res[0],
                vehilce_city: res[0].rb_city_name,
                vehicle_state: res[0].rb_state_name,
              });
            });
        }
      }
    });
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    if (this.vehicleType === 'new') {
      this.proposalVehilceDetailsForm
        .get('registration_number')
        ?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('registration_number')
        ?.updateValueAndValidity();
    } else {
      this.proposalVehilceDetailsForm
        .get('registration_number')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('registration_number')
        ?.updateValueAndValidity();
    }
    let regNumber = sessionStorage.getItem('registrationNumber');
    if (regNumber) {
      this.isRegistrationNumber = true;
      this.proposalVehilceDetailsForm.patchValue({
        registration_number: regNumber,
      });
    }
    this.getPincodeList();
    this.getAgreementList();
    this.getFinancierList();
  }

  filterInsurer(name: string) {}

  proposalFinancierBlankData(data: any) {}
  getProposalVehicleData(isValid: any) {
    if (isValid) {
      const formValues = this.proposalVehilceDetailsForm.value;
      this.afterVehicleData.emit(formValues);
      this.shareData.createProposalId(
        'vehilce_details',
        this.proposalVehilceDetailsForm
      );

      /**
       * Unsubscribe before subscribing to avoid multiple subscriptions
       */
      if (this.proposalDetailsSubscription) {
        this.proposalDetailsSubscription.unsubscribe();
      }

      /**
       * subscribe to getProposalDetails and navigate after the response
       */
      this.proposalDetailsSubscription =
        this.shareData.getProposalDetails.subscribe((proposal) => {
          if (this.vehicleType === 'new' && proposal.vehicle_details !== null) {
            this.router.navigate([
              `/motor/quotes/proposal/${this.transactionId}/review`,
            ]);
            /**
             * Unsubscribe after navigation to avoid repeated navigation
             */
            this.proposalDetailsSubscription.unsubscribe();
          }
        });
    }
  }
  /**
   * we can access the checkbox value using this.financedToggle.nativeElement.checked
   */
  getFinacedValue() {
    this.isFinancedChecked =
      this.financedToggle?.nativeElement?.checked ?? this.isFinancedChecked;
    this.shareData.isFinancedAddress(this.isFinancedChecked);

    const financerControl = this.proposalVehilceDetailsForm.get('financer');
    const agreementTypeControl =
      this.proposalVehilceDetailsForm.get('agreement_type');
    const financerCityControl =
      this.proposalVehilceDetailsForm.get('financer_city');

    if (this.isFinancedChecked) {
      financerControl?.setValidators([Validators.required]);
      agreementTypeControl?.setValidators([Validators.required]);
      financerCityControl?.setValidators([Validators.required]);
    } else {
      financerControl?.clearValidators();
      agreementTypeControl?.clearValidators();
      financerCityControl?.clearValidators();
    }

    financerControl?.updateValueAndValidity();
    agreementTypeControl?.updateValueAndValidity();
    financerCityControl?.updateValueAndValidity();
  }
  getRegistrationAddressValue(isChecked?: any) {
    this.isChecked = this.registrationAddressToggle?.nativeElement?.checked
      ? this.registrationAddressToggle?.nativeElement?.checked
      : isChecked;
    this.shareData.registrationAddress(this.isChecked);
    if (this.isChecked) {
      this.proposalVehilceDetailsForm
        .get('vehicle_registration_address')
        ?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('vehicle_registration_address')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm.get('vehicle_pincode')?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('vehicle_pincode')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm.get('vehilce_city')?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('vehilce_city')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm.get('vehicle_state')?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('vehicle_state')
        ?.updateValueAndValidity();
    } else {
      this.proposalVehilceDetailsForm
        .get('vehicle_registration_address')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('vehicle_registration_address')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm
        .get('vehicle_pincode')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('vehicle_pincode')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm
        .get('vehilce_city')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('vehilce_city')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm
        .get('vehicle_state')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('vehicle_state')
        ?.updateValueAndValidity();
    }
  }
  /**
   * initializes the age list with ages between 18 and 70
   */
  getPincodeList() {
    const vehiclePincodeControl =
      this.proposalVehilceDetailsForm.get('vehicle_pincode');

    if (vehiclePincodeControl) {
      /**
       * Check if vehiclePincodeControl is not null
       */
      this.filteredPincodeList = vehiclePincodeControl.valueChanges.pipe(
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
            return this.apiservice.getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${value}`
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

  /**
   * Updates the form with the pincode data
   * @param pincodeData the pincode data
   */
  getSepratedPincodeData(pincodeData: any) {
    if (pincodeData) {
      this.proposalVehilceDetailsForm.patchValue({
        vehilce_city: pincodeData.rb_city_name,
        vehicle_state: pincodeData.rb_state_name,
      });
    }
  }
  /**
   * getAgreementList is a function that returns the agreement list for the vehicle Details
   */
  getAgreementList() {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.aggreement_type}?insurer_code=${
          JSON.parse(this.quoteData)['insurer_code']
        }`
      )
      .subscribe((response) => {
        this.agreementList = response;
      });
  }
  getFinancierList() {
    const financierData = this.proposalVehilceDetailsForm.get('financer');

    if (financierData) {
      /**
       * Check if financierData is not null
       */
      this.financerList = financierData.valueChanges.pipe(
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
            return this.apiservice.getRequestedResponse(
              `${ApiConstants.financier_List}?insurer_code=${
                JSON.parse(this.quoteData)['insurer_code']
              }&search_element=${value}`
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
  isFinanced: boolean = false;
  isVehicle: boolean = false;
  toggleCheckbox() {
    this.isFinanced = !this.isFinanced; // Toggle the state
    this.getFinacedValue(); // Call your method to handle the change
  }
  toggleCheckboxForIsVehicle() {
    this.isVehicle = !this.isVehicle; // Toggle the state
    this.getRegistrationAddressValue(this.isVehicle); // Call your method to handle the change
  }
  displayFinancier(data?: any) {
    if (data != null && data != 'No data') {
      this.financierId = data.rb_financier_id;

      return data ? data.financier_name : undefined;
    }
  }

  displayPincode(data?: any) {
    if (data != null && data != 'No data') {
      this.pinocodeId = data.rb_pincode;

      return data ? data.rb_pincode : undefined;
    }
  }
  onEnterKeyPressedForPincode() {
    const vehiclePincodeControl =
      this.proposalVehilceDetailsForm.get('vehicle_pincode');
    if (vehiclePincodeControl && vehiclePincodeControl.valid) {
      const enteredPincode = vehiclePincodeControl.value;
      this.getSepratedPincodeData(enteredPincode);
    }
  }
}
