import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from 'src/app/core/services/window-ref.service';
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {
  fetchCkycData:any;
  proceedData:any
  panelOpenState = false;
  isCkycLoaded: boolean = false;
  showVehicleOwnerDetails: boolean = false;
  showNomineeDetails: boolean = false;
  showVehicleDetails: boolean = false;
  showPreviousPolicyDetails: boolean = false;
  step1: boolean=true;
  step2: boolean=false;
  step3: boolean=false;
  step4: boolean=false;
  step5: boolean=false;
  constructor(public matDialog: WindowRef,public router: Router) { 
    
  }

  ngOnInit(): void {
  }

  loadCkyc(expansionName:string) {
    if(expansionName === 'ckyc'){
      this.isCkycLoaded = true;
    }else if(expansionName === 'Vehicle Owner Details'){
      this.showVehicleOwnerDetails = true
    }else if(expansionName === 'Nominee Details'){
      this.showNomineeDetails = true
    }else if(expansionName === 'Vehicle Details'){
      this.showVehicleDetails = true
    }else if(expansionName === 'Previous Policy Details'){
      this.showPreviousPolicyDetails = true
    }
  }


  /**
   * get ckyc data 
   */ 
  getProceedData(data:any){
  this.proceedData=data
  if(data){
    this.step1=false
    this.step2=true;
    this.showVehicleOwnerDetails = true;
  }
  }
  vehicleOwnerDetailsData(data:any){
    if(data){
      this.step2=false
      this.step3=true;
    }
  }
  nomineeDetailsData(data:any){
    if(data){
      this.step3=false
      this.step4=true;
    }
  }
  proposerVehicleDetailsData(data:any){
    if(data){
      this.step4=false
      this.step5=true
    }
  }
  getVehicleOwnerData(data:any){
    if(data){
      this.showNomineeDetails = true;
    }
  }
  getNomineeData(data:any){
    if(data){
      this.showVehicleDetails = true
    }
  }
  getVehicleData(data:any){
    if(data){
      this.showPreviousPolicyDetails = true
    }
  }
  back() {
    this.router.navigate(['/motor/quotes']);
  }
}
