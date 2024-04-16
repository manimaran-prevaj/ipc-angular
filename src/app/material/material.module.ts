import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
	imports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatButtonToggleModule
	],
	exports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatButtonToggleModule
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				subscriptSizing: 'dynamic',
				appearance: 'fill',
			}
		},
		provideNativeDateAdapter()
	],
})

export class MaterialModule { }
