import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-chasis-number',
  templateUrl: './chasis-number.component.html',
  styleUrls: ['./chasis-number.component.scss']
})
export class ChasisNumberComponent implements OnInit {
  chassisForm!: FormGroup;
  @Input('required') isRequired = false;

  constructor(private ctrlContainer: FormGroupDirective) { }

  ngOnInit(): void {
    /**
      * add form control for the engine number
      */
    this.chassisForm = this.ctrlContainer.form;
    if (this.isRequired) {
      this.chassisForm.addControl(
        'chassis_number',
        new FormControl(null, Validators.required),
      );
    } else {
      this.chassisForm.addControl('chassis_number', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the engine number
     */
    this.chassisForm.removeControl('chassis_number');
  }

}
