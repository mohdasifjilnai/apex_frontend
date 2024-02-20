import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-proposal-vehicle-details',
  templateUrl: './proposal-vehicle-details.component.html',
  styleUrls: ['./proposal-vehicle-details.component.scss'],
})
export class ProposalVehicleDetailsComponent implements OnInit {
  @Output() afterFormSubmit = new EventEmitter<any>();
  filteredPincodeList!: Observable<any[]>;
  agreementList: any;
  filteredFinancierList!: any;
  financerList: any;
  @Input() fetchNomineeDetails:any;
  @Output() afterVehicleData = new EventEmitter<any>();


  proposalVehilceDetailsForm: FormGroup = new FormGroup({
    registration_number: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^([A-Z]{2}-\d{2}-[A-Z0-9]{2}-\d{4}|[A-Z]{2}-\d{2}-\d{4}|[A-Z]{2}-\d{2}-[A-Z]{3}-\d{4}|\d{2}-[A-Z]{2}-\d{4}-[A-Z]{1,2}|\d{2}-[A-Z]{2}-\d{4}-[A-Z]{2})$/
      ),
    ]),
    vehicle_colour: new FormControl('', Validators.required),
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
    previous_insurer: new FormControl('', Validators.required),
    financer: new FormControl('', Validators.required),
    agreement_type: new FormControl('', Validators.required),
    financer_city: new FormControl('', Validators.required),
  });

  constructor(private apiservice: ApiService) {
    this.agreementList = [
      {
        id: 1,
        agreementName: '',
      },
    ];
    this.financerList = [
      {
        id: 1,
        financerName: '',
      },
    ];
  }

  ngOnInit(): void {
  }

  filterInsurer(name: string) {}

  proposalFinancierBlankData(data: any) {}

  submitFormGroup() {
    this.afterFormSubmit.emit('Proposer Vehicle details Form Submited');
  }
  getProposalVehicleData(isValid:any){
    const formValues = this.proposalVehilceDetailsForm.value;
    this.afterVehicleData.emit(formValues)
  }
}
