import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'app-customer-details',
	templateUrl: './customer-details.component.html',
	styleUrls: ['./customer-details.component.scss'],
})

export class CustomerDetailsComponent implements OnInit {
	public customerDetailsForm: FormGroup;
	public minDate = new Date();
	public maxDate = new Date();

	constructor(
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.minDate.setDate(this.minDate.getDate() - 0);
		// TODO :: revisit maxdate logic later
		this.maxDate.setDate(this.maxDate.getDate() + 21);
		this.customerDetailsForm = this.formBuilder.group({
			firstName: ["", [Validators.required]],
			lastName: ["", [Validators.required]],
			email: ["", [Validators.required, Validators.email]],
			phone: ["", [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
			phoneExt: [""],
			datePicker: [this.minDate, [Validators.required]],
			modeOfDelivery: ["delivery", [Validators.required]],
			emailOpt: [""]
		});
	}

	onlyNumber(event) {
		const ASCIICode = (event.which) ? event.which : event.keyCode
		if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
			return false;
		}
		return true;
	}
}
