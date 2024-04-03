import { Component, OnInit } from "@angular/core";

@Component({
	selector: 'app-logo-date',
	templateUrl: './logo-date.component.html',
	styleUrls: ['./logo-date.component.scss'],
})

export class LogoDateComponent implements OnInit {
	dateTime: { date: string, time: string };

	ngOnInit(): void {
		this.getTodayDate();
	}

	getTodayDate() {
		const date = new Date();
		const fullDate = date.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "long", day: "2-digit" });
		const fullTime = date.toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", second: "2-digit" });
		this.dateTime = {
			date: fullDate,
			time: fullTime
		}

	}
}
