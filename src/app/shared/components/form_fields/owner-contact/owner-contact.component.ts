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
  selector: 'app-owner-contact',
  templateUrl: './owner-contact.component.html',
  styleUrls: ['./owner-contact.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerContactComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() readonly: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the owner contact
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'contact_number',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('contact_number', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the owner contact
     */
    this.form.removeControl('contact_number');
  }
  onFieldChange() {
    const control = this.form.get('contact_number');
    const value = control?.value;
    if (value && value.includes('*')) {
      control?.setValue(null, { emitEvent: false }); // Update the value to null without triggering `valueChanges` again
    }
  }
}
