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
    
    return this.apiservice.getRequestedResponse(`${ApiConstants.get_previous_insurer}?search_element=${name}`).subscribe((res)=>{
      if(res){
        this.insurerList = res;
        // this.filteredMMV = this.mmvList;
         /**
         * when input field value changes than valueChanges is used
         */
    this.filteredInsurerList = this.form.controls['previous_insurer'].valueChanges
    .pipe(
      debounceTime(1000),
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
