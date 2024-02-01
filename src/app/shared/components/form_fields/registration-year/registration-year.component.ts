import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-registration-year',
  templateUrl: './registration-year.component.html',
  styleUrls: ['./registration-year.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RegistrationYearComponent implements OnInit {
  form!: FormGroup;
  yearList: any;
  @Input('required') isRequired = false;
  constructor(private ctrlContainer: FormGroupDirective) {
    this.yearList = [
      {
        id: 1,
        year: '2019',
      },
      {
        id: 2,
        year: '2020',
      },
      {
        id: 3,
        year: '2021',
      },
      {
        id: 4,
        year: '2022',
      },
      {
        id: 5,
        year: '2023',
      },
      {
        id: 6,
        year: '2024',
      },
    ];
  }

  ngOnInit(): void {
    /**
     *add form control for the Registration Year
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'registration_year',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('registration_year', new FormControl());
    }
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Registration Year
     */
    this.form.removeControl('registration_year');
  }
}
