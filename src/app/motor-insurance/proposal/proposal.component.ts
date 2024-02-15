import { Component, OnInit } from '@angular/core';
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
  constructor(public matDialog: WindowRef) { 
    
  }

  ngOnInit(): void {}

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
  }

}
