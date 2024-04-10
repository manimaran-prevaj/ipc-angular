import { Component } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";

export interface SideNavItem {
	icon: string;
	alt: string;
	text: string
}

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	animations: [
		trigger('onSideNavChange', [
			state('close',
				style({
					'width': '80px'
				})
			),
			state('open',
				style({
					'width': '220px'
				})
			),
			transition('close => open', animate('350ms ease-in')),
			transition('open => close', animate('350ms ease-out')),
		])
	]
})

export class SideNavComponent {
	public isSideNavExpanded: boolean;
	public sideNavItemsList: SideNavItem[] = [
		{ icon: "customer", alt: "new customer", text: "New Customer" },
		{ icon: "search", alt: "new customer", text: "Find Order" },
		{ icon: "feedback", alt: "feedback", text: "Feedback" },
		{ icon: "edit", alt: "change order id", text: "Change Order ID" },
		{ icon: "checkbox", alt: "verifications", text: "Verifications" }
	]

	onSideNavToggle() {
		this.isSideNavExpanded = !this.isSideNavExpanded;
	}
}
