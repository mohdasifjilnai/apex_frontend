import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manufacture-date',
  templateUrl: './manufacture-date.component.html',
  styleUrls: ['./manufacture-date.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ManufactureDateComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input()customManufactureDate!:string

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    // add form control for the Manufacture Date
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'manufacture_date',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('manufacture_date', new FormControl());
    }
  }

  ngOnDestroy(): void {
    // remove form control for the Manufacture Date
    this.form.removeControl('manufacture_date');
  }
}
