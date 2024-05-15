import { Directive, HostListener, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[formControlName][appPhoneMask]',
})
export class CCCPhoneMaskDirective implements OnDestroy {

	constructor(public ngControl: NgControl) { }

	@HostListener('ngModelChange', ['$event'])
	onModelChange(event) {
		this.onInputChange(event, false);
	}

	@HostListener('keydown.backspace', ['$event'])
	keydownBackspace(event) {
		this.onInputChange(event.target.value, true);
	}


	onInputChange(event, backspace) {
		if (event) {
			let newVal = event.replace(/\D/g, '');
			if (backspace && newVal.length <= 6) {
				newVal = newVal.substring(0, newVal.length - 1);
			}
			if (newVal.length === 0) {
				newVal = '';
			} else if (newVal.length <= 3) {
				newVal = newVal.replace(/^(\d{0,3})/, '($1)');
			} else if (newVal.length <= 6) {
				newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
			} else if (newVal.length <= 10) {
				newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
			} else {
				newVal = newVal.substring(0, 10);
				newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
			}

			this.ngControl.valueAccessor?.writeValue(newVal);
		}
	}

	ngOnDestroy(): void {
		this._removeHostListeners();
	}

	private _removeHostListeners(): void {
		window.removeEventListener('ngModelChange', this.onModelChange);
		window.removeEventListener('keydown.backspace', this.keydownBackspace);
	}
}
