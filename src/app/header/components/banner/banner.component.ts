import { Component } from "@angular/core";

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss'],
})

export class BannerComponent {
	bannerContent = `Don’t forget to upsell and earn extra cash by selling the 3 pack of pop to every customer...`;
}
