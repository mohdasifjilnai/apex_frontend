import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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

  constructor(private ctrlContainer: FormGroupDirective) { }

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
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the engine number
     */
    this.engineForm.removeControl('engine_number');
  }

}
