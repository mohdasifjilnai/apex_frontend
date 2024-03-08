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
import { Observable, debounceTime } from 'rxjs';
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
  @Input() fetchNomineeDetails: any;
  @Output() afterVehicleData = new EventEmitter<any>();
  @ViewChild('financedToggle', { static: false }) financedToggle!: ElementRef;
  @ViewChild('registrationAddressToggle', { static: false })
  registrationAddressToggle!: ElementRef;

  proposalVehilceDetailsForm: FormGroup = new FormGroup({
    registration_number: new FormControl('', [Validators.required]),
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
    is_vehicle_address: new FormControl('', Validators.required),
  });

  constructor(
    private apiservice: ApiService,
    private shareData: SharedDataService
  ) {
    this.agreementList = [
      {
        id: 1,
        agreementName: 'other',
      },
    ];
    this.financerList = [
      {
        id: 1,
        financerName: 'other',
      },
    ];
  }

  ngOnInit(): void {
    this.shareData.getProposalDetails.subscribe((proposal) => {
      if (proposal?.vehicle_details !== null) {
        this.proposalVehilceDetailsForm.patchValue({
          registration_number: proposal?.vehicle_details?.registration_no,
          vehicle_colour: proposal?.vehicle_details?.vehicle_color,
          engine_number: proposal?.vehicle_details?.engine_no,
          chassis_number: proposal?.vehicle_details?.chassis_no,
          registration_date: proposal?.vehicle_details?.registration_date,
          manufacture_date: proposal?.vehicle_details?.manufacture_date,
          vehicle_pincode:
            proposal?.vehicle_details?.registration_address?.pincode,
          vehilce_city:
            proposal?.vehicle_details?.registration_address?.rb_city_id,
          vehicle_state:
            proposal?.vehicle_details?.registration_address?.rb_state_id,
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
      }
    });
  }

  filterInsurer(name: string) {}

  proposalFinancierBlankData(data: any) {}
  getProposalVehicleData(isValid: any) {
    console.log(this.proposalVehilceDetailsForm, 'shiva');
    if (isValid) {
      const formValues = this.proposalVehilceDetailsForm.value;
      this.afterVehicleData.emit(formValues);
      this.shareData.createProposalId(
        'vehilce_details',
        this.proposalVehilceDetailsForm
      );
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
  getRegistrationAddressValue() {
    const isChecked = this.registrationAddressToggle.nativeElement.checked;
    if (isChecked) {
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
    }
  }
}
