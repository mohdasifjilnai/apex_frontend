import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-previous-insurer',
  templateUrl: './previous-insurer.component.html',
  styleUrls: ['./previous-insurer.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class PreviousInsurerComponent implements OnInit {
  insurerList: any;
  form!: FormGroup;
  @Input('required') isRequired = false;
  @Input() previousInsurer!: string;
  @Input() disablePreviousInsurer: any;

  filteredInsurerList!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  previousInsurerNoData = '';
  prevoiusInsurerId: any;
  @Input() formControlNameData: any;
  disableInsurerField = true;
  routerEvents: any;
  currentPageUrl: any;

  constructor(
    private ctrlContainer: FormGroupDirective,
    private apiservice: ApiService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**
     *add form control for the Previous Insurer
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'previous_insurer',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('previous_insurer', new FormControl());
    }
    this.getInsurerData('');

    this.sharedDataService.disableInsurer.subscribe((res) => {
      this.disableInsurerField = res;
      if (this.disableInsurerField) {
        this.form.controls['previous_insurer'].disable();
      } else {
        this.form.controls['previous_insurer'].enable();
      }
    });
    if (this.disablePreviousInsurer) {
      this.form.controls['previous_insurer'].disable();
    }
  }

  getInsurerData(name: any) {
    this.apiservice
      .getRequestedResponse(ApiConstants.get_previous_insurer)
      .subscribe((res) => {
        if (res) {
          this.insurerList = res;
          this.previousInsurerNoData = '';
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.filteredInsurerList = this.form.controls[
              'previous_insurer'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterInsurer(name) : this.insurerList;
              })
            );
            this.previousInsurerNoData = '';
          } else {
            this.previousInsurerNoData = res.message;
            this.filteredInsurerList = this.form.controls[
              'previous_insurer'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterInsurer(name) : ['No data'];
              })
            );
          }
        }
      });
  }

  /**
   *
   * @param name filterMMV used for filter MMV data
   * @returns
   */
  filterInsurer(name: string) {
    return this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_previous_insurer}?search_element=${name}`
      )
      .subscribe((res) => {
        if (res) {
          this.insurerList = res;
          // this.filteredMMV = this.mmvList;
          /**
           * when input field value changes than valueChanges is used
           */
          if (res.length > 0) {
            this.filteredInsurerList = this.form.controls[
              'previous_insurer'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterInsurer(name) : this.insurerList;
              })
            );
            this.previousInsurerNoData = '';
          } else {
            this.previousInsurerNoData = res.message;
            this.filteredInsurerList = this.form.controls[
              'previous_insurer'
            ].valueChanges.pipe(
              debounceTime(1000),
              startWith(''),
              map((name) => {
                return name ? this.filterInsurer(name) : ['No data'];
              })
            );
          }
        }
      });
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Previous Insurer
     */
    this.form.removeControl('previous_insurer');
  }

  displayPreviousInsurer(data?: any) {
    if (data != null && data != 'No data') {
      this.prevoiusInsurerId = data.rb_insurer_id;
      return data ? data.rb_insurer_name : undefined;
    }
  }

  previousInsurerBlankData(data: any) {
    if (data == '') {
      this.getInsurerData('');
    }
  }
}
