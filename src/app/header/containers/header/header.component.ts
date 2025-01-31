import { Component, OnInit } from "@angular/core";
import { Store } from '@ngrx/store';
import { loadAppConfig } from "../../../common/store/actions/app-config.actions";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
	
	constructor(private store: Store){

	}

	ngOnInit(): void {
		

		this.store.dispatch(loadAppConfig());
	}

}
