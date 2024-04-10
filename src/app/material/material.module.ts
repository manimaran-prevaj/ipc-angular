import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
	imports: [
		MatCardModule,
		MatSidenavModule,
	],
	exports: [
		MatCardModule,
		MatSidenavModule,
	],
})

export class MaterialModule { }
