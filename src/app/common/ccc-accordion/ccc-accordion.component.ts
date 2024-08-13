import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
	selector: 'app-ccc-accordion',
	templateUrl: './ccc-accordion.component.html',
	styleUrl: './ccc-accordion.component.scss'
})
export class CCCAccordionComponent  implements OnInit{
	@Input() title: string;
	@Input() id: string;
	@Input() disabled: boolean;
	@Input() expanded: boolean;
	@Input() accordionDesc: TemplateRef<any>;
	@Input() showDynamicDesc = false;

	public panelOpenState: boolean;

	ngOnInit(): void {
		console.log(this.accordionDesc)

		console.log(this.title)	
	}
	
}
