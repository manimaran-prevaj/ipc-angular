import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
	imports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule
	],
	exports: [
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule
	],
})

export class MaterialModule { }
