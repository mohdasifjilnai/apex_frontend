import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nominee-details',
  templateUrl: './nominee-details.component.html',
  styleUrls: ['./nominee-details.component.scss']
})
export class NomineeDetailsComponent implements OnInit {
  relationshipList:any
  @Output() afterFormSubmit = new EventEmitter<any>();
  @Input() fetchOwnerVehicleDetails :any;
  @Output() afterProceedGetData = new EventEmitter<any>();

  nominneForm:FormGroup = new FormGroup({
    nominne_full_Name:new FormControl('',Validators.required),
    date_of_birth:new FormControl('',Validators.required),
    nominne_relation:new FormControl('',Validators.required)
  })

  constructor() {
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
    this.afterProceedGetData.emit(formValues)
  }
  submitFormGroup() {
    this.afterFormSubmit.emit('Nominee-details Form Submited');
  }

}
