import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

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

  filteredInsurerList!: Observable<any[]>;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  constructor(private ctrlContainer: FormGroupDirective,private apiservice:ApiService) {
    // this.insurerList = [
    //   {
    //     "rb_insurer_id": 1,
    //     "rb_insurer_name": "New India Assurance"
    //   },
    //   {
    //     "rb_insurer_id": 2,
    //     "rb_insurer_name": "Tata AIG General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 3,
    //     "rb_insurer_name": "United India Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 4,
    //     "rb_insurer_name": "National Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 5,
    //     "rb_insurer_name": "Oriental Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 6,
    //     "rb_insurer_name": "Bajaj Allianz General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 7,
    //     "rb_insurer_name": "ICICI Lombard General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 8,
    //     "rb_insurer_name": "IFFCO TOKIO General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 9,
    //     "rb_insurer_name": "Reliance General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 10,
    //     "rb_insurer_name": "ROYALSUNDARAM ALLIANCE Insurance CO. Ltd."
    //   },
    //   {
    //     "rb_insurer_id": 11,
    //     "rb_insurer_name": "Cholamandalam General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 12,
    //     "rb_insurer_name": "Future Generali General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 13,
    //     "rb_insurer_name": "Universal Sompo General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 14,
    //     "rb_insurer_name": "Shriram General Insurance Company"
    //   },
    //   {
    //     "rb_insurer_id": 15,
    //     "rb_insurer_name": "Bharti Axa General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 16,
    //     "rb_insurer_name": "Raheja QBE General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 17,
    //     "rb_insurer_name": "SBI General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 18,
    //     "rb_insurer_name": "L&T General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 19,
    //     "rb_insurer_name": "HDFC ERGO General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 20,
    //     "rb_insurer_name": "Magma HDI General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 21,
    //     "rb_insurer_name": "Liberty Videocon General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 22,
    //     "rb_insurer_name": "KOTAK MAHINDRA GENERAL INSURANCE COMPANY LTD"
    //   },
    //   {
    //     "rb_insurer_id": 23,
    //     "rb_insurer_name": "Digit Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 24,
    //     "rb_insurer_name": "ACKO GENERAL INSURANCE"
    //   },
    //   {
    //     "rb_insurer_id": 25,
    //     "rb_insurer_name": "DHFL INSURANCE"
    //   },
    //   {
    //     "rb_insurer_id": 26,
    //     "rb_insurer_name": "Edelweiss General Insurance Company Limited"
    //   },
    //   {
    //     "rb_insurer_id": 27,
    //     "rb_insurer_name": "Navi General Insurance"
    //   },
    //   {
    //     "rb_insurer_id": 35,
    //     "rb_insurer_name": "Zuno General Insurance Company"
    //   }
    // ]
  }

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
  }

  getInsurerData(name:any){
    this.apiservice.getRequestedResponse(ApiConstants.get_previous_insurer).subscribe((res)=>{
      if(res){
         this.insurerList = res;
               /**
           * when input field value changes than valueChanges is used
           */
      this.filteredInsurerList = this.form.controls['previous_insurer'].valueChanges
      .pipe(
        startWith(''),
        map(name =>{  
       
        return name ? this.filterInsurer(name) : this.insurerList
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
   filterInsurer(name: string) {
    
    return this.apiservice.getRequestedResponse(ApiConstants.get_previous_insurer).subscribe((res)=>{
      if(res){
        this.insurerList = res;
        // this.filteredMMV = this.mmvList;
         /**
         * when input field value changes than valueChanges is used
         */
    this.filteredInsurerList = this.form.controls['previous_insurer'].valueChanges
    .pipe(
      startWith(''),
      map(name =>{  
     
      return name ? this.filterInsurer(name) : this.insurerList
    }
      )
    );
      }
     
  })
  }

  

  ngOnDestroy(): void {
    /**
     * remove form control for the Previous Insurer
     */
    this.form.removeControl('previous_insurer');
  }
}
