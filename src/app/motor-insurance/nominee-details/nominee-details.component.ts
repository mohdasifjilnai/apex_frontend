import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  nominneForm: FormGroup = new FormGroup({
    nominne_full_Name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    nominne_relation: new FormControl('', Validators.required),
  });

  constructor(private sharedData: SharedDataService) {
    this.minDate = new Date(1930, 6, 1);
    const currentDate = new Date();
    this.maxDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    this.relationshipList = [
      {
        id: 1,
        relationName: 'Father',
      },
      {
        id: 2,
        relationName: 'Mother',
      },
    ];
  }

  ngOnInit(): void {
    /**
     * initializes the age list with ages between 18 and 70
     */
    for (let age = 18; age <= 70; age++) {
      this.ageList.push({
        id: age - 17,
        age: age,
      });
    }
  }

  getNomineeDetails(isValid: boolean) {
    if (isValid) {
      const formValues = this.nominneForm.value;
      this.afterNomineeGetData.emit(formValues);
      this.sharedData?.createProposalId('nominne_details', this.nominneForm);
    }
  }
}
