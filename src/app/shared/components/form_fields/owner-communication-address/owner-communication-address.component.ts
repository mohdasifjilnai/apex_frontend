import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-owner-communication-address',
  templateUrl: './owner-communication-address.component.html',
  styleUrls: ['./owner-communication-address.component.scss'],
})
export class OwnerCommunicationAddressComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    /**
     * add form control for the Owner Communication Addres
     */

    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'owner_communication_addres',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('owner_communication_addres', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Owner State
     */
    this.form.removeControl('owner_communication_addres');
  }
}
