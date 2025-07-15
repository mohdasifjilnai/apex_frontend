import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-chasis-number',
  templateUrl: './chasis-number.component.html',
  styleUrls: ['./chasis-number.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ChasisNumberComponent implements OnInit {
  chassisForm!: FormGroup;
  @Input('required') isRequired = false;
  visuallyDisabledFields: any = false;
  constructor(private ctrlContainer: FormGroupDirective,private shareDataService:SharedDataService
  ) { }

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
    this.visuallyDisabledFields = this.shareDataService.disableVisually(['chassis_number'], this.chassisForm);
    this.shareDataService.errorEngineNumberValue.subscribe((res)=>{
      if (res === 'chassis') {
        const chassisControl = this.chassisForm.get('chassis_number');
        chassisControl?.setErrors({ invalidEngineNumber: true });
        chassisControl?.markAsTouched(); // ensures mat-error displays
      }
    })
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the engine number
     */
    this.chassisForm.removeControl('chassis_number');
  }
  onFieldChange() {
    const control = this.chassisForm.get('chassis_number');
    const value = control?.value;
    if (value && value.includes('***')) {
      control?.setValue(null, { emitEvent: false }); // Update the value to null without triggering `valueChanges` again
    }
  }
}
