import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ShareQuotesComponent } from '../share-quotes/share-quotes.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
declare const webengage: any;
@Component({
  selector: 'app-selected-share',
  templateUrl: './selected-share.component.html',
  styleUrls: ['./selected-share.component.scss'],
})
export class SelectedShareComponent implements OnInit {
  @Input() quotes: any[] = [];
  quotesLength: any;
  shareQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ShareQuotesComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  quoteItem: any;
  constructor(
    public matDialog: WindowRef,
    public dialogRef: MatDialogRef<SelectedShareComponent>,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.quoteItem = this.sharedDataService.getQuoteItem();
  }
  /**
   * Share Quotes POP-UP and BottomSheet Open
   */
  shareQuotes(quotes: any) {
    let vehicleTypeValue = sessionStorage.getItem('vehicleType');
    // webengage.track('Shared_Selected_clicked', {
    //   Quotes_Selected: quotes.length,
    //   User_Type: sessionStorage.getItem('partner_code')
    //     ? 'Partner'
    //     : 'Customer',
    //   Motor_Type: vehicleTypeValue,
    // });
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: quotes,
    };
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(ShareQuotesComponent, bottomSheetConfig);
      this.cancel(false);
    } else {
      this.openModal(quotes, this.shareQuotesJSON);
      this.cancel(false);
    }
  }
  shareAllQuotes() {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: this.quoteItem,
    };
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(ShareQuotesComponent, bottomSheetConfig);
      this.cancel(false);
    }
  }
  @Output() notifyParent: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Method to notify the parent component with a condition
  cancel(condition: boolean) {
    this.notifyParent.emit(condition);
  }
  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '0';
    }

    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
}
