import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-rto',
  templateUrl: './rto.component.html',
  styleUrls: ['./rto.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class RTOComponent implements OnInit {
  // @Input() cities: any[] = [];
  @Input('required') isRequired = false;

  form!: FormGroup;
  rtoList:any;

  filteredRtoList!: Observable<any[]>;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  constructor(private ctrlContainer: FormGroupDirective,private apiservice:ApiService) {}

  ngOnInit(): void {
    /**
     *add form control for the RTO city
     */
    this.form = this.ctrlContainer.form;
    if (this.isRequired) {
      this.form.addControl(
        'rto_city',
        new FormControl(null, Validators.required),
      );
    } else {
      this.form.addControl('rto_city', new FormControl());
    }
    this.getRTOData();

    // this.form.controls['rto_city'].valueChanges.subscribe((val: any) => {
    //     console.log(val);
        
    // });
  }


  getRTOData(){
    this.apiservice.getRequestedResponse(ApiConstants.get_rto_list).subscribe((res)=>{
      if(res){
         this.rtoList = res;
               /**
           * when input field value changes than valueChanges is used
           */
      this.filteredRtoList = this.form.controls['rto_city'].valueChanges
      .pipe(
        debounceTime(1000),
        startWith(''),
        map(name =>{  
       
        return name ? this.filterRTO(name) : this.rtoList
      }
        )
      );
      }
     
  })
  }

   /**
   * 
   * @param name filterMMV used for filter MMV data
   * @returns 
   */
   filterRTO(name: string) {
    
    return this.apiservice.getRequestedResponse(`${ApiConstants.get_rto_list}?search_element=${name}`).subscribe((res)=>{
      if(res){
        this.rtoList = res;
         /**
         * when input field value changes than valueChanges is used
         */
    this.filteredRtoList = this.form.controls['rto_city'].valueChanges
    .pipe(
      startWith(''),
      map(name =>{  
     
      return name ? this.filterRTO(name) : this.rtoList
    }
      )
    );
      }
     
  })
  }

  ngOnDestroy(): void {
    /**
     * remove form control for the RTO city
     */
    this.form.removeControl('rto_city');
  }
}
