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
  @Input() fetchNomineeDetails: any;
  @Output() afterVehicleData = new EventEmitter<any>();
  @ViewChild('financedToggle', { static: false }) financedToggle!: ElementRef;
  @ViewChild('registrationAddressToggle', { static: false })
  registrationAddressToggle!: ElementRef;
  isManufactureDateDisbaled: boolean = false;
  isRegistrationDateDisbaled: boolean = false;
  isRegistrationNumber: boolean = false;
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
  vehicleType: any;

  constructor(
    private apiservice: ApiService,
    private shareData: SharedDataService,
    private router: Router
  ) {
    this.agreementList = [
      {
        id: 1,
        agreementName: 'other',
      },
    ];
  }

  ngOnInit(): void {
    let fetchQuotesData = sessionStorage.getItem('forQuotesFetchData');
    if (fetchQuotesData) {
      const quoteData = JSON.parse(fetchQuotesData);
      const manufacture_month = quoteData['manufacture_month'];
      const manufacture_year = quoteData['manufacture_year'];

      const manufactureDate = new Date(
        manufacture_year,
        manufacture_month - 1,
        1
      );
      if (manufactureDate) {
        this.isManufactureDateDisbaled = true;
      }
      if (quoteData['registration_date']) {
        this.isRegistrationDateDisbaled = true;
      }

      this.proposalVehilceDetailsForm.patchValue({
        registration_date: quoteData['registration_date'],
        manufacture_date: manufactureDate,
      });
    }

    this.shareData.getProposalDetails.subscribe((proposal) => {
      if (proposal?.vehicle_details !== null) {
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
        this.proposalVehilceDetailsForm.patchValue({
          registration_number: proposal?.vehicle_details?.registration_no,
          vehicle_colour: proposal?.vehicle_details?.vehicle_color,
          engine_number: proposal?.vehicle_details?.engine_no,
          chassis_number: proposal?.vehicle_details?.chassis_no,
          registration_date: this.shareData.parseDate(
            proposal?.vehicle_details?.registration_date,
            'DD/MM/YYYY'
          ),
          manufacture_date: this.shareData.parseDate(
            proposal?.vehicle_details?.manufacture_date,
            'MM/YYYY'
          ),
          vehicle_pincode:
            proposal?.vehicle_details?.registration_address?.pincode,
          financer: proposal?.vehicle_details?.financer_details?.financer_name,
          agreement_type:
            proposal?.vehicle_details?.financer_details?.agreement_type,
          financer_city:
            proposal?.vehicle_details?.financer_details?.financer_branch,
          is_financed: proposal?.vehicle_details?.is_vehicle_financed,
          vehicle_registration_address:
            proposal?.vehicle_details?.registration_address?.address_line,
          is_vehicle_address: proposal?.vehicle_details?.is_same_location,
        });
        if (
          this.proposalData?.customer_details?.communication_address?.pincode
        ) {
          this.apiservice
            .getRequestedResponse(
              `${ApiConstants.pincode}?pincode=${this.proposalData?.customer_details?.communication_address?.pincode}`
            )
            .subscribe((res) => {
              this.proposalVehilceDetailsForm.patchValue({
                owner_city: res[0].rb_city_name,
                vehilce_city: res[0].rb_state_name,
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
    this.getFinancierList();
    this.getPincodeList();
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
      if (this.vehicleType === 'new') {
        this.router.navigate([
          `/motor/quotes/proposal/${this.transactionId}/review`,
        ]);
      }
    }
  }
  /**
   * we can access the checkbox value using this.financedToggle.nativeElement.checked
   */
  getFinacedValue() {
    const isChecked = this.financedToggle.nativeElement.checked;
    if (isChecked) {
      this.proposalVehilceDetailsForm
        .get('financer')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm.get('financer')?.updateValueAndValidity();
      this.proposalVehilceDetailsForm
        .get('agreement_type')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('agreement_type')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm
        .get('financer_city')
        ?.setValidators([Validators.required]);
      this.proposalVehilceDetailsForm
        .get('financer_city')
        ?.updateValueAndValidity();
    } else {
      this.proposalVehilceDetailsForm.get('financer')?.setValidators([]);
      this.proposalVehilceDetailsForm.get('financer')?.updateValueAndValidity();
      this.proposalVehilceDetailsForm.get('agreement_type')?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('agreement_type')
        ?.updateValueAndValidity();
      this.proposalVehilceDetailsForm.get('financer_city')?.setValidators([]);
      this.proposalVehilceDetailsForm
        .get('financer_city')
        ?.updateValueAndValidity();
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
  getFinancierList() {
    this.apiservice
      .getRequestedResponse(ApiConstants.financier_type)
      .subscribe((response) => {
        this.financerList = response;
      });
  }
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
        owner_city: pincodeData.rb_city_name,
        owner_state: pincodeData.rb_state_name,
      });
    }
  }
}
