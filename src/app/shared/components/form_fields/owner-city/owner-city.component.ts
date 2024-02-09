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
  selector: 'app-owner-city',
  templateUrl: './owner-city.component.html',
  styleUrls: ['./owner-city.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OwnerCityComponent implements OnInit {
  form!: FormGroup;
  @Input('required') isRequired = false;
  filteredCityList!: Observable<any[]>;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  constructor(private ctrlContainer: FormGroupDirective) {}

  ngOnInit(): void {
    /**
     * add form control for the City
     */

    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'owner_city',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('owner_city', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the City
     */
    this.form.removeControl('owner_city');
  }
}
