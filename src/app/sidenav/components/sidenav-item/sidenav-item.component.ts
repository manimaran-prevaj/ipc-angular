import { Component, Input } from "@angular/core";
import { SideNavItem } from "../../containers/sidenav/sidenav.component";

@Component({
	selector: 'app-sidenav-item',
	templateUrl: './sidenav-item.component.html',
	styleUrls: ['./sidenav-item.component.scss']
})

export class SideNavItemComponent {
	@Input() sideNavItem: SideNavItem;
	@Input() isSideNavExpanded: boolean;
}
