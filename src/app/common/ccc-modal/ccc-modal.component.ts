import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ModalData {
	title: string;
	cancelText: string;
	confirmText: string;
	/** Diabling eslint as content is of TemplateRef<any> is of type generic  */
	/* eslint-disable */
	content: any;
	/* eslint-enable */
}

@Component({
	selector: 'app-ccc-modal',
	templateUrl: './ccc-modal.component.html',
	styleUrl: './ccc-modal.component.scss'
})

export class CCCModalComponent {
	public title: string;
	public cancelText: string;
	public confirmText: string;
	/** Diabling eslint as content is of TemplateRef<any> is of type generic  */
	/* eslint-disable */
	public content: any;
	/* eslint-enable */


	constructor(
		public dialogRef: MatDialogRef<CCCModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ModalData
	) {
		this.title = data.title;
		this.confirmText = data.confirmText;
		this.cancelText = data.cancelText;
		this.content = data.content;
	}
}
