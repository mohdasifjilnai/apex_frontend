import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
  selector: 'app-rto',
  templateUrl: './rto.component.html',
  styleUrls: ['./rto.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RTOComponent implements OnInit {
  @Input('required') isRequired = false;

  form!: FormGroup;
  rtoList: any;

  filteredRtoList!: any;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;
  rtoDataNotAvailable: any = '';
  rtoId: any;
  private debounceSubject = new Subject<any>();
  @Output() responseEvent = new EventEmitter<string>();
  rtoDataLength: any;
  constructor(
    private ctrlContainer: FormGroupDirective,
    private apiservice: ApiService,
    private shareData:SharedDataService
  ) {}

  ngOnInit(): void {
    /**
     *add form control for the RTO city
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'rto_city',
        new FormControl(null, Validators.required)
      );
    } else {
      this.form.addControl('rto_city', new FormControl());
    }
    this.debounceSubject
      .pipe(
        debounceTime(300) // Adjust the debounce time as needed (in milliseconds)
      )
      .subscribe((data: any) => {
        if (data?.length >= 2) {
          this.getRTOData(data);
        }
      });
  }
  sendResponse(response: string) {
    this.responseEvent.emit(response);
  }
  getRTOData(name: any) {
    this.apiservice
      .getRequestedResponse(
        `${ApiConstants.get_rto_list}?search_element=${name
          ?.replace(/[()]/g, '')
          .replace(/\s+/g, ' ')
          .trim()}`
      )
      .subscribe((res) => {
        if (res && res.length > 0 && !res.message) {
          this.rtoList = res;
          this.rtoDataNotAvailable = '';
          this.filteredRtoList = this.form.controls[
            'rto_city'
          ].valueChanges.pipe(
            debounceTime(500),
            startWith(name),
            switchMap((name) => this.filterRTO(name, res)),
            catchError((error) => {
              this.rtoDataNotAvailable = 'Error fetching data';
              return of(['No result found']);
            })
          );
        } else {
          this.rtoDataNotAvailable = 'No data available';
          this.filteredRtoList = of(['No result found']);
        }
      });
    this.sendResponse(this.rtoDataNotAvailable);
  }

  filterRTO(name: string, rtoResponse: any): Observable<any[]> {
    if (typeof name != 'object') {
      // return this.apiservice
      //   .getRequestedResponse(
      //     `${ApiConstants.get_rto_list}?search_element=${name}`
      //   )
      //   .pipe(
      //     map((res) => {
      if (rtoResponse && !rtoResponse?.message) {
        if (Array.isArray(rtoResponse)) {
          this.rtoList = rtoResponse;
        } else if (typeof rtoResponse === 'object') {
          this.rtoList = [rtoResponse];
        }
        this.rtoDataNotAvailable =
          this.rtoList.length === 0 ? 'No result found' : '';

        return of(this.rtoList);
      } else {
        this.rtoDataNotAvailable = 'No data available';
        return of([this.rtoDataNotAvailable]);
        // this.filteredRtoList = of(['No data']);
      }
      //   })
      // );
    }
    return of([]);
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the RTO city
     */
    this.form.removeControl('rto_city');
  }
  displayRto(data?: any) {
    if (data != null && data !== 'No result found') {
      this.rtoId = data.rb_rto_id;
      return data ? data.display_name : undefined;
    }
  }

  rtoBlankData(data: any) {
    this.rtoDataLength = data.length;
    this.sendResponse(data);
    // if (typeof data == 'object') {
    //   this.sendResponse(data);
    // }
    // Emit the data to the debounceSubject
    this.debounceSubject.next(data);
  }
  onOpened(): void {
    this.shareData.onOpenedAutoComplete();
  }

  onClosed(): void {
    this.shareData.onClosedAutoComplete();
  }
}
