import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
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
  }


  getRTOData(){
    this.apiservice.getRequestedResponse(ApiConstants.get_rto_list).subscribe((res)=>{
      if(res){
         this.rtoList = res;
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
