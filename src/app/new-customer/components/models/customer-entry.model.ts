/**
 * Order date and time interface
 */
export interface OrderDateTime {
	date: string;
	times: string[];
	day_code?: string;
}

/**
 * Dwelling type options interface
 */
export interface DwellingTypeOptions {
	text: string;
	value: string;
}

/**
 * Address dwelling type interface
 */
export interface DwellingType {
	type: string;
	instructions: Instructions[];
	aptNumber?: string;
	buzzerNumber?: string;
	unitNumber?: string;
	siteNumber?: string;
	roomNumber?: string;
	guestName?: string | null; // Optional property
	alternativeNumber?: string | null; // Optional property
	wingName?: string;
	floorNumber?: string;
	businessName?: string;
	alternativePhoneNumber?: string;
	hallName?: string;
}

/**
 * Instructions for dwelling type interface
 */
export interface Instructions {
	text: string;
	value: string
}

/**
 * Province type options interface
 */
export interface ProvinceOptions {
	text: string;
	value: string;
}
