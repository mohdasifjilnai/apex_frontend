import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-owner-state',
  templateUrl: './owner-state.component.html',
  styleUrls: ['./owner-state.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerStateComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() formControlNameData: any;
  filteredStateList!: Observable<any[]>;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  @Input() label: any;
  @Input() idAutomation: any;

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    /**
     * add form control for the Owner State
     */

    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        this.formControlNameData,
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl(this.formControlNameData, new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Owner State
     */
    this.form.removeControl(this.formControlNameData);
  }
}
