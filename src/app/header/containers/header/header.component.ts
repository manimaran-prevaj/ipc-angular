import { Component, OnInit } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { selectAppConfig } from "../../../common/store";
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
		this.store.pipe(select(selectAppConfig)).subscribe(x=>{
			console.log(x);
		});

		this.store.dispatch(loadAppConfig());
	}

}
