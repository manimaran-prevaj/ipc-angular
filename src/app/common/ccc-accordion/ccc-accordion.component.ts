import { Component, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'app-ccc-accordion',
	templateUrl: './ccc-accordion.component.html',
	styleUrl: './ccc-accordion.component.scss'
})
export class CCCAccordionComponent {
	
	@Input() title: string;
	@Input() id: string;
	@Input() disabled: boolean;
	@Input() expanded: boolean;
	@Input() accordionDesc: TemplateRef<any>;
	@Input() showDynamicDesc = false;

	public panelOpenState: boolean;

	public panelClosed(){
		this.panelOpenState = false;
		this.showDynamicDesc = true;
	}

	public panelOpened(){
		this.panelOpenState = true;
		this.showDynamicDesc = false;
	}
	
}
