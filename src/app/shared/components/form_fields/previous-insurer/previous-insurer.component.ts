import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NavigationEnd, Router } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
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
  @Input() label: any;

  filteredInsurerList!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  previousInsurerNoData = '';
  prevoiusInsurerId: any;
  @Input() formControlNameData: any;
  disableInsurerField = true;
  routerEvents: any;
  currentPageUrl: any;
  @Output() responseEvent = new EventEmitter<string>();
  patchInsurer: any;
  private debounceSubject = new Subject<any>();
  insururDataLength: any;
  registrationNumber: any;
  allValue: any;
  visuallyDisabledFields: any = false;
  fieldShow = false;
  @Input() urlDate: any;
  isRenewalDashboard = false;
  url: any;
  constructor(
    private ctrlContainer: FormGroupDirective,
    private apiservice: ApiService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private renderer: Renderer2,
    private shareDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.url = this.router.url;
    if (this.url.includes('renewalScreeningDashboard')) {
      this.isRenewalDashboard = true;
      this.getInsurerData('');
    }
    if (this.urlDate == 'instantQuotation') {
      this.fieldShow = true;
    }
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        this.formControlNameData,
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl(this.formControlNameData, new FormControl());
    }
    if (
      !this.form.get(this.formControlNameData)?.value &&
      this.urlDate == 'quotes'
    ) {
      this.form.get(this.formControlNameData)?.markAsTouched();
    }

    this.debounceSubject.pipe(debounceTime(300)).subscribe((data) => {
      if (this.isRenewalDashboard) {
        this.getInsurerData(data ?? '');
      } else {
        if (data?.length > 2) {
          this.getInsurerData(data);
        }
      }
    });

    this.sharedDataService.disableInsurer.subscribe((res) => {
      this.disableInsurerField = res;
      this.form.patchValue({
        previous_insurer: '',
      });
      if (this.disableInsurerField) {
        this.form.controls['previous_insurer']?.disable();
      } else {
        this.form.controls['previous_insurer']?.enable();
      }
    });
    if (this.disablePreviousInsurer) {
      this.form.controls['previous_insurer'].disable();
    }

    this.sharedDataService.regNumberDataRenewal.subscribe(
      (renewalregistartionnumber: any) => {
        this.registrationNumber = renewalregistartionnumber;
        if (this.registrationNumber?.previous_insurer_code) {
          this.getInsurerData(this.registrationNumber?.previous_insurer_code);
        }
      }
    );

    this.sharedDataService.regNumberData.subscribe((numberData) => {
      if (numberData) {
        this.registrationNumber = numberData;
        this.getInsurerData(this.registrationNumber?.previous_insurer_code);
      } else {
        this.registrationNumber = JSON.parse(
          sessionStorage.getItem('registrationDetails') || '{}'
        );
        if (this.registrationNumber?.previous_insurer_code) {
          let insurerCode = this.registrationNumber?.previous_insurer_code
            ? this.registrationNumber?.previous_insurer_code
            : (this.registrationNumber.previous_insurer_code =
                this.registrationNumber?.rb_insurer_code);
          if (insurerCode != undefined) {
            this.getInsurerData(insurerCode);
          }
        }
      }
    });

    this.sharedDataService.renewalVehicleData.subscribe((value: any) => {
      if (value) {
        this.allValue = JSON.parse(value);

        this.getInsurerData(this.allValue.quotesRequest.previous_insurer_code);
      }
    });

    // let renewalType = sessionStorage.getItem('renewalType');
    // if (renewalType == 'renewal' || renewalType == 'rollover') {
    //   // this.form.get('previous_insurer')?.disable();
    // }
    this.visuallyDisabledFields = this.shareDataService.disableVisually(
      ['previous_insurer'],
      this.form
    );
  }
  sendResponse(response: string) {
    this.responseEvent.emit(response);
  }
  getInsurerData(name: any) {
    this.shareDataService.previousInsurerDisabled(true);
    if (name != null) {
      this.apiservice
        .getRequestedResponse(
          `${ApiConstants.get_previous_insurer()}?search_element=${name}`
        )
        .subscribe((res) => {
          if (res && !res?.message) {
            this.shareDataService.previousInsurerDisabled(false);
            this.insurerList = res;
            this.previousInsurerNoData = '';
            const renwalType = sessionStorage.getItem('renewalType');
            if (renwalType == 'renewal') {
              this.sharedDataService.patchInsurer(this.insurerList[0]);
            }
            // if (this.form.controls['previous_insurer']) {
            this.filteredInsurerList = this.form.controls[
              'previous_insurer'
            ]?.valueChanges.pipe(
              debounceTime(500),
              startWith(''),
              switchMap((name) => this.filterInsurer(name, res)),
              catchError((error) => {
                this.previousInsurerNoData = 'Error fetching data';
                return of(['No result found']);
              })
            );
            if (this.registrationNumber?.previous_insurer_code) {
              for (let i = 0; i <= this.insurerList.length - 1; i++) {
                if (
                  this.insurerList[i].rb_insurer_code ==
                  this.registrationNumber?.previous_insurer_code
                ) {
                  this.patchInsurer = this.insurerList[i];
                  this.sharedDataService.patchInsurer(this.patchInsurer);
                }
              }
            } else if (this.allValue?.quotesRequest) {
              for (let i = 0; i <= this.insurerList.length - 1; i++) {
                if (
                  this.insurerList[i].rb_insurer_code ==
                  this.allValue.quotesRequest.previous_insurer_code
                ) {
                  this.patchInsurer = this.insurerList[i];
                  this.sharedDataService.patchInsurer(this.patchInsurer);
                }
              }
            }
            // }
          } else {
            this.previousInsurerNoData = 'No result found';
            this.filteredInsurerList = of(['No result found']);
            if (this.url.includes('renewalScreeningDashboard')) {
              this.form.get(this.formControlNameData)?.setErrors(null);
            } else {
              this.form.controls['previous_insurer'].setValidators([
                Validators.required,
              ]);
            }
            this.sharedDataService.patchInsurer('No result found');
          }
          this.visuallyDisabledFields = this.shareDataService.disableVisually(
            ['previous_insurer'],
            this.form
          );
        });
      this.sendResponse(this.previousInsurerNoData);
    }
  }

  filterInsurer(name: string, insururResponse: any): Observable<any[]> {
    if (typeof name != 'object') {
      // return this.apiservice
      //   .getRequestedResponse(
      //     `${ApiConstants.get_previous_insurer}?search_element=${name}`
      //   )
      //   .pipe(
      //     map((res) => {
      if (insururResponse.length > 0) {
        if (Array.isArray(insururResponse)) {
          this.insurerList = insururResponse;
        } else if (typeof insururResponse === 'object') {
          this.insurerList = [insururResponse];
        }
        this.previousInsurerNoData =
          this.insurerList.length === 0 ? 'No result found' : '';
        return of(this.insurerList);
      } else {
        this.previousInsurerNoData = 'No result found';
        return of([this.previousInsurerNoData]);
      }
      //   })
      // );
    }
    return of([]);
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the Previous Insurer
     */
    this.form.removeControl('previous_insurer');
  }

  displayPreviousInsurer(data?: any) {
    if (data != null && data != 'No result found') {
      this.prevoiusInsurerId = data.rb_insurer_id;
      return data ? data.rb_insurer_name : undefined;
    }
  }

  previousInsurerBlankData(data: any) {
    if (typeof this.form.value[this.formControlNameData] == 'object') {
      this.form.get(this.formControlNameData)?.setErrors(null);
    } else {
      if (this.url.includes('renewalScreeningDashboard')) {
        this.form.get(this.formControlNameData)?.setErrors(null);
      } else {
        this.form
          .get(this.formControlNameData)
          ?.setErrors({ validPreviousInsurer: true });
      }
      this.insururDataLength = data?.length;
      this.sendResponse(data);

      // if (typeof data == 'object') {
      //   this.sendResponse(data);
      // }
      this.debounceSubject.next(data);
    }
  }
  /**
   * Removes the "dropdown-focus" class from the body element.
   */
  inputClicked() {
    this.renderer.removeClass(document.body, 'dropdown-focus');
  }
  onOpened(): void {
    this.sharedDataService.onOpenedAutoComplete();
  }

  onClosed(): void {
    this.sharedDataService.onClosedAutoComplete();
  }
}
