import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-owner-full-name',
  templateUrl: './owner-full-name.component.html',
  styleUrls: ['./owner-full-name.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerFullNameComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() formControlNameData: any;
  @Input() label:any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the full_name
     */
  
    this.form = this.ctrlContainer.form;
 
    if (this.isRequired) {
      this.form.addControl(
        this.formControlNameData,
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl(this.formControlNameData, new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the full_name
     */
    this.form.removeControl('full_Name');
  }
}
