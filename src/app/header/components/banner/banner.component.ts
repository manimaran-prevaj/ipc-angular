import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { selectAppConfig } from "../../../common/store";

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss'],
})

export class BannerComponent implements OnInit {
	bannerContent = '';

	constructor(private store: Store){

	}

	ngOnInit(): void {
		this.store.pipe(select(selectAppConfig)).subscribe(x=>{
			const resp: any = x;
			if (resp?.appConfig?.bannerMessage) {
				this.bannerContent = resp.appConfig.bannerMessage;
			}
		});

	
	}
}
