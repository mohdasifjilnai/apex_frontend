import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class VehicleComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;

  constructor(private ctrlContainer: FormGroupDirective) {
   }

  ngOnInit(): void {
    /**
     * add form control for the vehicle
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'vehicle',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('vehicle', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the vehicle
     */
   this.form.removeControl('vehicle');
 }

}
