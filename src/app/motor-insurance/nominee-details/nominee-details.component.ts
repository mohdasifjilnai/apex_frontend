import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-nominee-details',
  templateUrl: './nominee-details.component.html',
  styleUrls: ['./nominee-details.component.scss'],
})
export class NomineeDetailsComponent implements OnInit {
  relationshipList: any;
  minDate = new Date();
  maxDate = new Date();
  ageList: { id: number; age: number }[] = [];
  @Input() fetchOwnerVehicleDetails: any;
  @Output() afterNomineeGetData = new EventEmitter<any>();
  quoteData: any;
  previousDetails: any;
  details: any;

  nominneForm: FormGroup = new FormGroup({
    nominne_full_Name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    nominne_relation: new FormControl('', Validators.required),
  });

  constructor(
    private sharedData: SharedDataService,
    private apiService: ApiService
  ) {
    this.minDate = new Date(1930, 6, 1);
    const currentDate = new Date();
    this.maxDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );
  }

  ngOnInit(): void {
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    /**
     * initializes the age list with ages between 18 and 70
     */
    for (let age = 18; age <= 70; age++) {
      this.ageList.push({
        id: age - 17,
        age: age,
      });
    }
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      if (proposal?.nominee_details !== null) {
        this.nominneForm.patchValue({
          nominne_full_Name: proposal?.nominee_details?.name,
          age: proposal?.nominee_details?.age,
          nominne_relation: proposal?.nominee_details?.relation_id,
        });
      }
    });
    this.getRelationshipsList();

    let renewalType = sessionStorage.getItem('renewalType');
    // if (renewalType == 'renewal') {
    //   this.nominneForm?.disable();
    // }

    this.previousDetails = sessionStorage.getItem('RenewalPreviousDetails');
    this.details = JSON.parse(this.previousDetails);

    const nomineeDetails =
      this.details?.previous_policy_details?.nominee_details;
    const calculatedAge = this.calculateAge(nomineeDetails?.age);
    this.nominneForm.patchValue({
      nominne_full_Name: nomineeDetails?.name,
      age: calculatedAge,
      nominne_relation: nomineeDetails?.relation_id,
    });
  }

  /** function to calculate nominee age from the DOB */
  calculateAge(birthdate: string): number {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Submits the nominee form data to the parent component.
   * @param isValid - Indicates whether the form is valid or not.
   */
  getNomineeDetails(isValid: boolean) {
    if (isValid) {
      const formValues = this.nominneForm.value;
      this.afterNomineeGetData.emit(formValues);
      this.sharedData?.createProposalId('nominne_details', this.nominneForm);
    }
  }

  /**
   * initializes the age list with ages between 18 and 70
   */
  getRelationshipsList() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.relation_type}?insurer_code=${this.quoteData?.insurer_code}`
      )
      .subscribe((response) => {
        this.relationshipList = response;
      });
  }
}
