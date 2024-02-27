import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nominee-details',
  templateUrl: './nominee-details.component.html',
  styleUrls: ['./nominee-details.component.scss']
})
export class NomineeDetailsComponent implements OnInit {
  relationshipList:any
  minDate = new Date();
  maxDate = new Date();
  @Input() fetchOwnerVehicleDetails :any;
  @Output() afterNomineeGetData = new EventEmitter<any>();

  nominneForm:FormGroup = new FormGroup({
    nominne_full_Name:new FormControl('',Validators.required),
    date_of_birth:new FormControl('',Validators.required),
    nominne_relation:new FormControl('',Validators.required)
  })

  constructor() {
    this.minDate = new Date(1930, 6, 1);
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    this.relationshipList = [
      {
        id:1,
        relationName:"Father"
      },
      {
        id:2,
        relationName:"Mother"
      }
    ]
   }

  ngOnInit(): void {
  }

  getNomineeDetails(isValid:boolean){
    const formValues = this.nominneForm.value;
    this.afterNomineeGetData.emit(formValues)
  }
  
}
