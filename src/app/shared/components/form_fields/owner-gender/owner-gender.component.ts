import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-gender',
  templateUrl: './owner-gender.component.html',
  styleUrls: ['./owner-gender.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerGenderComponent implements OnInit {
  genderList:any;
  form!: FormGroup;
  @Input('required') isRequired = false

  constructor(private ctrlContainer: FormGroupDirective) {
    this.genderList = [ 
      {
        id:1,
        name:"Male"
      },
      {
        id:2,
        name:"Female"
      }
    ]
   }

  ngOnInit(): void {
    /**
     * add form control for the Gender
     */

    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'gender',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('gender', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Gender
     */

    this.form.removeControl('gender');
  }

}
