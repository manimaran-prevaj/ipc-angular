import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'pizza-pizza-ccc';
	date = new Date();
	fullDate = this.date.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "long", day: "numeric" });
	time = this.date.toLocaleTimeString('en-us');
	dateTime = this.fullDate + ' ' + this.time;
}
