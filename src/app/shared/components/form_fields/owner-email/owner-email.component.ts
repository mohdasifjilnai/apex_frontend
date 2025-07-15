import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

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
    private fb: FormBuilder,
    private shareDataService: SharedDataService

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
    this.shareDataService.errorEngineNumberValue.subscribe((res)=>{
      if (res === 'email') {
        const engineControl = this.form.get('owner_email');
        engineControl?.setErrors({ invalidEmail: true });
        engineControl?.markAsTouched(); // ensures mat-error displays
      }
    })
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the owner email
     */
    this.form.removeControl('owner_email');
  }
  onFieldChange() {
    const control = this.form.get('owner_email');
    const value = control?.value;
    if (value && value.includes('*')) {
      control?.setValue(null, { emitEvent: false }); // Update the value to null without triggering `valueChanges` again
    }
  }
}
