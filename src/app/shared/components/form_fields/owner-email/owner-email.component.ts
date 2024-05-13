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
  selector: 'app-owner-email',
  templateUrl: './owner-email.component.html',
  styleUrls: ['./owner-email.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerEmailComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() readonly: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the owner email
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'owner_email',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('owner_email', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the owner email
     */
    this.form.removeControl('owner_email');
  }
}
