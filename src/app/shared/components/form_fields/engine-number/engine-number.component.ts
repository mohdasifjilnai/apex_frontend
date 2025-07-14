import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-engine-number',
  templateUrl: './engine-number.component.html',
  styleUrls: ['./engine-number.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class EngineNumberComponent implements OnInit {
  engineForm!: FormGroup;
  @Input('required') isRequired = false;
  visuallyDisabledFields: any = false;

  constructor(private ctrlContainer: FormGroupDirective, private shareDataService: SharedDataService) { }

  ngOnInit(): void {
     /**
      * add form control for the engine number
      */
     this.engineForm = this.ctrlContainer.form;
     if (this.isRequired) {
       this.engineForm.addControl(
         'engine_number',
         new FormControl(null, Validators.required),
       );
     } else {
       this.engineForm.addControl('engine_number', new FormControl());
     }
    this.visuallyDisabledFields = this.shareDataService.disableVisually(['engine_number'], this.engineForm);
    this.shareDataService.errorEngineNumberValue.subscribe((res)=>{
      if (res === 'engine') {
        const engineControl = this.engineForm.get('engine_number');
        engineControl?.setErrors({ invalidEngineNumber: true });
        engineControl?.markAsTouched(); // ensures mat-error displays
      }
    })
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the engine number
     */
    this.engineForm.removeControl('engine_number');
  }
  onFieldChange() {
    const control = this.engineForm.get('engine_number');
    const value = control?.value;
    if (value && value.includes('*')) {
      control?.setValue(null, { emitEvent: false }); // Update the value to null without triggering `valueChanges` again
    }
  }
}
