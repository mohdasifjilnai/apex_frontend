import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';


function _window(): any {
  return window;
}
@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }
  dialogConfig = new MatDialogConfig();
  constructor(public dialog: MatDialog,private overlay: Overlay) {
    this.dialogConfig.height = '50%';
    this.dialogConfig.width = '50%';
    this.dialogConfig.maxWidth = '90vw';
    this.dialogConfig.maxHeight = '100vh';
    this.dialogConfig.position = {
        top: '5%',
        left: 'auto'
    };
    this.dialogConfig.minWidth = '50%';
  }

  // /**
  //  * This Function open the vehicle Details popup
  //  */
  // openDialog(data:any=null,component:any,parentClass:any='',isOutSideDisable:boolean=true): void {
    
  //   /**
  //    * Open the dialog using the MatDialog service
  //    */
  //   const dialogRef = this.dialog.open(component, {
  //     /**
  //      * Set the width of the dialog
  //      */
  //     width: '750px',
  //     /**
  //      * Set the position of the dialog at the top of the screen with a small margin from the top
  //      */
  //     position: { top: '9.50rem' },
  //     panelClass:parentClass,
  //       data: {
  //         data
  //       },

  //     disableClose: isOutSideDisable,
  //   });

  //   /**
  //    * Subscribe to the afterClosed event to perform actions when the dialog is closed
  //    */
  //   dialogRef.afterClosed().subscribe((result) => {});
  // }

  
  /**
   *  this fucntion use for all pop up modal open 
   */ 
  openDialog(obj: any): Observable<any> {
    let childComponent: any = null;    
    const { width, height, minWidth, classNameObtained,isOutSideClose, dataInfo } = obj;
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    this.dialogConfig.data = dataInfo;
    this.dialogConfig.disableClose=isOutSideClose
    childComponent=obj.modalName
    
    /**
     * These need to be changed  as number should be configurable.
     * Curently it is not .
     * TODOS- On urgent basis need to change
     */
    if (width) {
        this.dialogConfig.width = width;
    }
    if (height) {
        this.dialogConfig.height = height;
    }
    if (minWidth) {
        this.dialogConfig.minWidth = minWidth;
    }
    if (classNameObtained) {
        this.dialogConfig.panelClass = classNameObtained;
    }

    if (this.dialogConfig.data['top']) {
        this.dialogConfig.position = {
            top: this.dialogConfig.data['top'],
        };
    }

    if (this.dialogConfig.data['left']) {
        this.dialogConfig.position = {
            left: this.dialogConfig.data['left']
        };
    }


    const dialogRef = this.dialog.open(childComponent, {
        data: this.dialogConfig.data,
        position: this.dialogConfig.position,
        width: this.dialogConfig.width,
        height: this.dialogConfig.height,
        minWidth: this.dialogConfig.minWidth,
        disableClose: this.dialogConfig.disableClose,
        panelClass: this.dialogConfig.panelClass,
        scrollStrategy,
    });

    return dialogRef.afterClosed();
}
}
