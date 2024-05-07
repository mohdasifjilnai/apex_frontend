import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-owner-communication-address',
  templateUrl: './owner-communication-address.component.html',
  styleUrls: ['./owner-communication-address.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerCommunicationAddressComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  proposalErrorMsg: any;
  isNotShowErrorMsg: boolean = true;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    /**
     * add form control for the Owner Communication Addres
     */

    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'owner_communication_addres',
        new FormControl(null, [Validators.required, Validators.minLength(10)])
      );
    } else {
      this.form.addControl('owner_communication_addres', new FormControl());
    }

    this.sharedDataService.getErrorProposalDetails.subscribe((errData) => {
      if (errData?.detail[0]) {
        for (let error of errData?.detail[0]?.loc) {
          if (error === 'address_line') {
            this.proposalErrorMsg = errData?.detail[0]?.msg;
          }
        }
      }
    });
    this.form
      .get('owner_communication_addres')
      ?.valueChanges.subscribe((res) => {
        if (res.length <= 10) {
          this.isNotShowErrorMsg = false;
        }
      });
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Owner State
     */
    this.form.removeControl('owner_communication_addres');
  }
}
