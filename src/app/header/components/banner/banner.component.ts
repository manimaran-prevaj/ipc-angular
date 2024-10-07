import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectBannerMessage } from "../../../common/store";
import { Observable } from "rxjs";

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss'],
})

export class BannerComponent {
	bannerContent = '';
	bannerMessage$: Observable<string>;

	constructor(private store: Store){
		this.bannerMessage$ = this.store.select(selectBannerMessage);
	}
}
