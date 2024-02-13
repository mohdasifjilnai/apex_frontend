import { Component, OnInit } from '@angular/core';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { WaitCkycVerificationDialogComponent } from '../../shared/components/dialog-components/wait-ckyc-verification-dialog/wait-ckyc-verification-dialog.component';
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {
  panelOpenState = false;
  waitCkycVerificationJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: WaitCkycVerificationDialogComponent,
    widthObtained: '75%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'wait-ckyc-verification-class',
  };
  isCkycLoaded: boolean = false;
  showVehicleOwnerDetails: boolean = false;
  showNomineeDetails: boolean = false;
  showVehicleDetails: boolean = false;
  showPreviousPolicyDetails: boolean = false;
  constructor(public matDialog: WindowRef) { 
    
  }

  ngOnInit(): void {}
  /**
   * open wait ckyc modal popup
   */
  openWaitCkycModal(event: any) {
    // this.openWaitCkycVerificationPopup(null)
  }

  /**
   * this fucntion use wait ckyc verification modal
   */
  openWaitCkycVerificationPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '75%';
      resTop = '5%';
    }

    const obj: any = {
      modalName: this.waitCkycVerificationJSON['modalName'],
      width: this.waitCkycVerificationJSON['widthObtained'],
      height: this.waitCkycVerificationJSON['heightObtained'],
      classNameObtained: this.waitCkycVerificationJSON['classObtained'],
      isOutSideClose: this.waitCkycVerificationJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
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
  

}
