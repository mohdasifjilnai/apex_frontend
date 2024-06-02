import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
  proposalVehilceDetailsForm!: FormGroup;
  isChecked: any;
  isFinancedChecked: any;
  vehicleType: any;
  pincodeData: any;
  mmvData: any;
  productTypeValue: any;
  isBreakIn: any;
  mmvItem: any;
  isNotShowVehicleDetails: boolean = false;
  isDisableCKyc: boolean = false;
  RegNumber: any;
  isProposalFinancier = false;
  financierOninit = true;
  insurerCode: any;
  vehicleColor: any;
  previousInsurerCode: any;
  isVehicleButton: boolean = false;
  fetchedKyc: any;
  constructor(
    private apiservice: ApiService,
    private shareData: SharedDataService,
    private router: Router,
    private formBuild: FormBuilder
  ) {
    this.proposalForm();
  }
  /**
   * Initializes the form group with the appropriate controls and validators.
   */
  proposalForm() {
    this.proposalVehilceDetailsForm = this.formBuild.group({
      registration_number: [''],
      vehicle_colour: [''],
      engine_number: [
        '',
        [
          Validators.required,
          Validators.pattern('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$'),
        ],
      ],
      chassis_number: [
        '',
        [
          Validators.required,
          Validators.pattern(
            new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$')
          ),
          Validators.minLength(17),
          Validators.maxLength(25),
        ],
      ],
      registration_date: ['', Validators.required],
      manufacture_date: ['', Validators.required],
      vehicle_pincode: [
        '',
        [Validators.required, this.pincodeNumberValidator.bind(this)],
      ],
      vehilce_city: ['', Validators.required],
      vehicle_state: ['', Validators.required],
      financer: [''],
      agreement_type: [''],
      financer_city: [''],
      is_financed: [''],
      vehicle_registration_address: ['', Validators.required],
      is_vehicle_address: [''],
      registration_number_first: [''],
      registration_number_second: [''],
      registration_number_last_digit: [''],
    });
  }
  ngOnInit(): void {
    this.quoteData = sessionStorage.getItem('quotes_data');
    this.insurerCode = JSON.parse(this.quoteData)['insurer_code'];
    this.previousInsurerCode = sessionStorage.getItem('previous_insurerCode');
    if (this.insurerCode === 'sbi_general') {
      this.getVehicleColourList();
    }
    this.isBreakIn = JSON.parse(this.quoteData)['is_breakin'];
    this.productTypeValue = sessionStorage.getItem('productType');
    this.mmvData = sessionStorage.getItem('mmv_data');
    this.mmvItem = JSON.parse(this.mmvData);
    if (this.mmvItem) {
      if (this.mmvItem?.manufacture_date) {
        this.isManufactureDateDisbaled = true;
      }
      if (this.mmvItem?.registration_date) {
        this.isRegistrationDateDisbaled = true;
      }
      this.proposalVehilceDetailsForm.patchValue({
        registration_date: this.mmvItem?.registration_date,
        manufacture_date: this.mmvItem?.manufacture_date,
        registration_number_first: this.divideString(
          this.mmvItem?.registration_city?.rb_rto_code
        )[0],
        registration_number_second: this.divideString(
          this.mmvItem?.registration_city?.rb_rto_code
        )[1],
      });
      this.proposalVehilceDetailsForm
        .get('registration_number_first')
        ?.disable();
      this.proposalVehilceDetailsForm
        .get('registration_number_second')
        ?.disable();
    }
    if (sessionStorage.getItem('registrationNumber')) {
      this.proposalVehilceDetailsForm.patchValue({
        registration_number: sessionStorage.getItem('registrationNumber'),
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
              proposal?.vehicle_details?.insurerCodeemanufacture_date,
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
        let renewalDataType = sessionStorage.getItem('renewalType');
        if (renewalDataType == 'renewal') {
          let regFirstDigit = proposal?.vehicle_details?.registration_no.slice(
            0,
            2
          );
          let regSecondDigit = proposal?.vehicle_details?.registration_no.slice(
            2,
            4
          );
          let combineRegData = regFirstDigit + regSecondDigit;
          let regLastDigit =
            proposal?.vehicle_details?.registration_no.split(combineRegData);
          if (regLastDigit) {
            const regParts = regLastDigit[1].match(/^([a-zA-Z]+)([0-9]+)$/);
            if (regParts) {
              regLastDigit = regParts.slice(1).join('-');
            }
          }
          const [dayReg, monthReg, yearReg] =
            proposal?.vehicle_details?.registration_date.split('/').map(Number);
          const reformattedRegDate = new Date(yearReg, monthReg - 1, dayReg);

          const [day, month, year] = proposal?.vehicle_details?.manufacture_date
            .split('/')
            .map(Number);
          const reformattedManufactureDate = new Date(year, month - 1, day);
          this.proposalVehilceDetailsForm.patchValue({
            registration_number: proposal?.vehicle_details?.registration_no,
            registration_number_last_digit: regLastDigit,
            registration_number_first: regFirstDigit,
            registration_number_second: regSecondDigit,
            registration_date: reformattedRegDate,
            manufacture_date: reformattedManufactureDate,
          });
        } else {
          this.proposalVehilceDetailsForm.patchValue({
            registration_number_last_digit:
              proposal?.vehicle_details?.registration_no
                ?.split('-')
                .slice(2)
                .join('-'),
          });
        }
        if ('sbi_general' === this.previousInsurerCode) {
          if (typeof proposal?.vehicle_details?.vehicle_color === 'number') {
            this.proposalVehilceDetailsForm.patchValue({
              vehicle_colour: proposal?.vehicle_details?.vehicle_color,
            });
          } else {
            this.proposalVehilceDetailsForm.patchValue({
              vehicle_colour: '',
            });
          }
        } else {
          this.proposalVehilceDetailsForm.patchValue({
            vehicle_colour: proposal?.vehicle_details?.vehicle_color,
          });
        }
        this.proposalVehilceDetailsForm.patchValue({
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
              `${ApiConstants.pincode}?pincode=${
                this.proposalData?.vehicle_details?.registration_address
                  ?.pincode
              }&insurer_code=${JSON.parse(this.quoteData)['insurer_code']}`
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
      if (
        kycData?.insurer_code == JSON.parse(this.quoteData)['insurer_code'] &&
        sessionStorage.getItem('proposerType') === kycData?.proposer_type &&
        proposal?.ckyc_details?.is_verification
      ) {
        this.isDisableCKyc = false;
      } else if (JSON.parse(this.quoteData)['insurer_code'] == 'united_india') {
        if (proposal?.ckyc_details?.is_verification) {
          this.isDisableCKyc = false;
        }
      } else if (
        sessionStorage.getItem('proposerType') !== undefined &&
        this.fetchedKyc?.proposer_type !== undefined &&
        this.fetchedKyc.proposer_type !== null &&
        sessionStorage.getItem('proposerType') !== this.fetchedKyc.proposer_type
      ) {
        this.isDisableCKyc = true;
      } else if (this.fetchedKyc?.verification_status) {
        this.isDisableCKyc = false;
      }
    });
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.vehicleType = sessionStorage.getItem('newVehicleType');
    if (this.vehicleType === 'new') {
      this.RegNumber = 'Reg. Number';
      this.proposalVehilceDetailsForm
        .get('registration_number_last_digit')
        ?.setValidators(this.registrationNumberCheckLength.bind(this));
    } else {
      this.RegNumber = 'Reg. Number *';
      this.proposalVehilceDetailsForm
        .get('registration_number_last_digit')
        ?.setValidators([
          Validators.required,
          this.registrationNumberCheckLength.bind(this),
        ]);
      this.proposalVehilceDetailsForm
        .get('registration_number_last_digit')
        ?.updateValueAndValidity();
    }
    let regNumber = sessionStorage.getItem('registrationNumber');
    if (regNumber) {
      this.isRegistrationNumber = true;
      let regFirstDigit = regNumber?.slice(0, 2);
      let regSecondDigit = regNumber?.slice(3, 5);
      let combineRegData = regFirstDigit + '-' + regSecondDigit + '-';
      let regLastDigit = regNumber.split(combineRegData);
      this.proposalVehilceDetailsForm.patchValue({
        registration_number_first: regFirstDigit,
        registration_number_second: regSecondDigit,
        registration_number_last_digit: regLastDigit[1],
      });
      this.proposalVehilceDetailsForm
        .get('registration_number_first')
        ?.disable();
      this.proposalVehilceDetailsForm
        .get('registration_number_second')
        ?.disable();
      this.proposalVehilceDetailsForm
        .get('registration_number_last_digit')
        ?.disable();
    }
    this.shareData?.nomineeData.subscribe((nominee) => {
      this.isNotShowVehicleDetails = nominee;
    });
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (Object.keys(kycData).length > 0) {
      if (
        kycData.insurer_code == JSON.parse(this.quoteData)['insurer_code'] &&
        kycData.verification_status == true
      ) {
        this.isDisableCKyc = false;
      } else if (JSON.parse(this.quoteData)['insurer_code'] === 'digit') {
        this.isDisableCKyc = false;
      } else if (this.fetchedKyc?.verification_status) {
        this.isDisableCKyc = false;
      } else {
        this.isDisableCKyc = true;
      }
    }

    this.shareData?.fetchedCkycData.subscribe((kyc) => {
      if (kyc) {
        this.fetchedKyc = kyc;
        this.isDisableCKyc = false;
      }
    });
    /**
     * disableVehicleDetails is use for handel the button enable and disable in case of previous vehicle details and vehicle details both showing
     */
    const disableVehicleDetails = this.shareData.setIsNotShowNomineeItem;
    if (disableVehicleDetails) {
      this.isDisableCKyc = false;
    }
    this.proposalVehilceDetailsForm
      .get('vehicle_pincode')
      ?.valueChanges.subscribe((pincode) => {
        if (pincode.length === 0) {
          this.proposalVehilceDetailsForm.patchValue({
            vehilce_city: '',
            vehicle_state: '',
          });
        }
      });
    this.shareData.getErrorProposalDetails.subscribe((errData) => {
      if (errData?.detail[0]) {
        for (let error of errData?.detail[0]?.loc) {
          if (error === 'address_line') {
            this.proposalVehilceDetailsForm.controls[
              'vehicle_registration_address'
            ].setErrors({ pattern: true });
          }
        }
      }
    });
    this.getPincodeList();
    this.getAgreementList();
    this.getFinancierList();
    let renewalType = sessionStorage.getItem('renewalType');
    if (renewalType == 'renewal') {
      this.proposalVehilceDetailsForm?.disable();
      this.isVehicleButton = true;
    }
  }

  filterInsurer(name: string) {}

  proposalFinancierBlankData(data: any) {
    if (this.isFinancedChecked) {
      if (!this.financierOninit) {
        if (typeof this.proposalVehilceDetailsForm.value.financer == 'object') {
          this.isProposalFinancier = false;
          this.proposalVehilceDetailsForm.get('financer')?.setErrors(null);
        } else {
          this.proposalVehilceDetailsForm
            .get('financer')
            ?.setErrors({ validFinancer: true });
          this.isProposalFinancier = true;
        }
      } else {
        this.financierOninit = false;
      }
    }
  }
  getProposalVehicleData(isValid: any) {
    if (isValid) {
      const formValues = this.proposalVehilceDetailsForm.value;
      if (
        this.mmvItem &&
        this.proposalVehilceDetailsForm.value.registration_number_last_digit
      ) {
        let registrationNumberFirst =
          this.divideString(this.mmvItem?.registration_city?.rb_rto_code)[0] +
          '-' +
          this.divideString(this.mmvItem?.registration_city?.rb_rto_code)[1] +
          '-' +
          this.proposalVehilceDetailsForm.value.registration_number_last_digit;
        this.proposalVehilceDetailsForm.patchValue({
          registration_number: registrationNumberFirst,
        });
      }

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
          if (
            (this.vehicleType === 'new' ||
              (this.isBreakIn && this.productTypeValue === 'satp') ||
              this.mmvItem?.policy_expiry === 'IDK') &&
            proposal.vehicle_details !== null
          ) {
            this.router.navigate([
              `quotes/proposal/${this.transactionId}/review`,
            ]);
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
      financerControl?.updateValueAndValidity();
      agreementTypeControl?.updateValueAndValidity();
      financerCityControl?.updateValueAndValidity();
    } else {
      financerControl?.reset();
      agreementTypeControl?.reset();
      financerCityControl?.reset();
      financerControl?.clearValidators();
      agreementTypeControl?.clearValidators();
      financerCityControl?.clearValidators();
      financerControl?.setValidators([]);
      agreementTypeControl?.setValidators([]);
      financerCityControl?.setValidators([]);
      financerControl?.updateValueAndValidity();
      agreementTypeControl?.updateValueAndValidity();
      financerCityControl?.updateValueAndValidity();
      this.isProposalFinancier = false;
    }
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
    if (data != null && data != 'No result found') {
      this.financierId = data.rb_financier_id;

      return data ? data.financier_name : undefined;
    }
  }

  displayPincode(data?: any) {
    if (data != null && data != 'No result found') {
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
  /**
   * Checks the length of a registration number and ensures it meets the minimum and maximum requirements.
   *
   * @param control - The FormControl to be validated.
   * @returns An object containing any validation errors or null if the control is valid.
   */
  registrationNumberCheckLength: ValidatorFn = (control: AbstractControl) => {
    if (control instanceof FormControl) {
      if (!control.value || typeof control.value !== 'string') {
        return null; // Don't validate if the control is empty or not a string
      }
      const valueToCheck = control.value.replace(/-/g, '');
      const minLength = 4;
      const maxLength = 7;

      if (valueToCheck.length < minLength) {
        return { minlength: true };
      }
      if (valueToCheck.length > maxLength) {
        return { maxlength: true };
      }
      if (
        !/^[A-Za-z]+\-[0-9]+$/.test(control.value) &&
        !/^[0-9]+\-[A-Za-z]+$/.test(control.value)
      ) {
        return { pattern: true };
      }
    }

    return null;
  };
  /**
   * Adds a hyphen to the end of the input value, if it does not already have one.
   * If the input value does not have a valid registration number format, it will attempt to correct it by adding hyphens where necessary.
   *
   * @param event - The input event that triggered this function.
   */
  addHyphen(event: any) {
    let value = event.target.value;
    sessionStorage.setItem(
      'isRegistrationNumber',
      String(
        this.proposalVehilceDetailsForm.controls[
          'registration_number_last_digit'
        ].valid
      )
    );
    if (
      this.proposalVehilceDetailsForm.controls['registration_number_last_digit']
        .valid
    ) {
      this.proposalVehilceDetailsForm.patchValue({
        registration_number:
          this.proposalVehilceDetailsForm.get('registration_number_last_digit')
            ?.value != ''
            ? this.proposalVehilceDetailsForm.get('registration_number_first')
                ?.value +
              '-' +
              this.proposalVehilceDetailsForm.get('registration_number_second')
                ?.value +
              '-' +
              this.proposalVehilceDetailsForm.get(
                'registration_number_last_digit'
              )?.value
            : '',
      });
    }

    if (sessionStorage.getItem('isRegistrationNumber') == 'false') {
      value = value.replace(/-/g, '');
      value = value.replace(/([A-Za-z])(?=\d)|(\d)(?=[A-Za-z])/g, '$1$2-');
      this.proposalVehilceDetailsForm.patchValue({
        registration_number_last_digit: value.toUpperCase(),
      });
      event.target.setSelectionRange(value.length, value.length);
    }
  }
  /**
   * Divides a string into two parts, splitting it down the middle.
   *
   * @param input - The string to split.
   * @returns An array containing the two parts of the split string.
   */
  divideString(input: string): [string, string] {
    const firstPartLength = Math.ceil(input?.length / 2);

    const firstPart = input?.slice(0, firstPartLength);
    const secondPart = input?.slice(firstPartLength);

    return [firstPart, secondPart];
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
  getVehicleColourList() {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.vehicle_color}?insurer_code=${
          JSON.parse(this.quoteData)['insurer_code']
        }`
      )
      .subscribe((vehicleColor) => {
        this.vehicleColor = vehicleColor;
      });
  }
}
