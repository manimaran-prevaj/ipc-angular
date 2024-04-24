import { Component, Input } from '@angular/core';

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

	public panelOpenState: boolean;
}
