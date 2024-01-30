import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [],
    imports: [
        // CommonModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatSidenavModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatTabsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatSortModule,
        MatExpansionModule,
        MatRadioGroup,
        MatSlideToggleModule,
        MatProgressBarModule,
        MatIconModule,
        MatTabsModule,
    
        MatTooltipModule,
        
    ],
    exports: [
        MatSlideToggleModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatSidenavModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatGridListModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatSortModule,
        MatSlideToggleModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        MatRadioGroup
    ],
    providers: [

        { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, verticalPosition: 'top' } },

    ],
})
export class MaterialModule { }
