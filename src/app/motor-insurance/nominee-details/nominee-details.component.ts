import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
declare const webengage: any;

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
  isExistCustomerId: any;
  private getCustomerIdDetails!: Subscription;
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
    this.sharedData.getVahaanDetails.subscribe((res: any) => {
      if (res?.nominee_details != null) {
        this.nominneForm.patchValue({
          nominne_full_Name: res?.nominee_details?.name,
          age: res?.nominee_details?.age,
          nominne_relation: res?.nominee_details?.relation_id,
        });
      }
    });
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
    const calculatedAge =
      nomineeDetails?.age != null ? this.calculateAge(nomineeDetails?.age) : '';
    if (nomineeDetails) {
      this.nominneForm.patchValue({
        nominne_full_Name: nomineeDetails?.name,
        age: calculatedAge,
        nominne_relation: nomineeDetails?.relation_id,
      });
    }
    this.getCustomerIdDetails = this.sharedData.getCustomerId.subscribe(
      (idValue) => {
        webengage.track('Motor_Nominee_Details_Submitted', {
          Nominee_Relation: this.nominneForm.value.nominne_relation,
          Age: this.nominneForm.value.age,
          User_Type: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Motor_Type: sessionStorage.getItem('vehicleType'),
          Customer_id: idValue.customer_id,
          Perform_by: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Partner_Name:
            sessionStorage.getItem('first_name') != null
              ? `${sessionStorage.getItem(
                  'first_name'
                )} ${sessionStorage.getItem(
                  'middle_name'
                )} ${sessionStorage.getItem('last_name')}`
              : '',
          Partner_id: sessionStorage.getItem('partner_code'),
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.getCustomerIdDetails.unsubscribe();
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
      this.isExistCustomerId = sessionStorage.getItem('webengageCustomerId');
      let CheckId = JSON.parse(this.isExistCustomerId);
      if (CheckId) {
        webengage.track('Motor_Nominee_Details_Submitted', {
          Nominee_Relation: this.nominneForm.value.nominne_relation,
          Age: this.nominneForm.value.age,
          User_Type: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Motor_Type: sessionStorage.getItem('vehicleType'),
          Customer_id: CheckId.customer_id,
          Perform_by: sessionStorage.getItem('partner_code')
            ? 'Partner'
            : 'Customer',
          Partner_Name:
            sessionStorage.getItem('first_name') != null
              ? `${sessionStorage.getItem(
                  'first_name'
                )} ${sessionStorage.getItem(
                  'middle_name'
                )} ${sessionStorage.getItem('last_name')}`
              : '',
          Partner_id: sessionStorage.getItem('partner_code'),
        });
      } else {
        let mobileNumber = sessionStorage.getItem('mobileNumber');
        this.sharedData.getCustomerIdForwebengae(
          mobileNumber,
          '',
          'Vehicle Details'
        );
      }

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
        if (response.length > 0) {
          this.nominneForm.get('nominne_relation')?.setValue(response[0].rb_id);
        }
      });
  }
}
