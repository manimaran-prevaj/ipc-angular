import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'app-customer-details',
	templateUrl: './customer-details.component.html',
	styleUrls: ['./customer-details.component.scss'],
})

export class CustomerDetailsComponent implements OnInit {
	public customerDetailsForm: FormGroup;
	constructor(
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.customerDetailsForm = this.formBuilder.group({
			firstName: ["", [Validators.required]],
			lastName: ["", [Validators.required]],
			email: ["", [Validators.required, Validators.email]],
			phone: ["", [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			phoneExt: [""],
			datePicker: ["", [Validators.required]],
			modeOfDelivery: ["delivery", [Validators.required]]
		});
	}

	onlyNumber(event) {
		let ASCIICode = (event.which) ? event.which : event.keyCode
		if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
			return false;
		}
		return true;
	}
}
