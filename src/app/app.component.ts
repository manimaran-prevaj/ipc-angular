import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
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
