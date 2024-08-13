import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

@NgModule({
	imports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatSelectModule,
		MatListModule
	],
	exports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatSelectModule,
		MatListModule
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				subscriptSizing: 'dynamic',
				appearance: 'fill',
			}
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				disableClose: true,
				minWidth: '50%',
				minHeight: '250px'
			}
		},
		provideNativeDateAdapter()
	],
})

export class MaterialModule { }
