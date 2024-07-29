export interface Customer{
    phone_num: string;
}

export interface CustomerAddress {
    address_name: string;
    address_type: string;
    apartment_number: string;
    building_key: string | null;
    city: string;
    created_by: string;
    created_on: string;
    entrance_specs: string;
    id: number;
    legacy_address_id: number;
    parent_id: number;
    phone_extension: string;
    phone_num: string;
    postal_code: string;
    province: string;
    saved: boolean;
    security_code: string;
    street_address: string;
    street_number: string;
    street_number_ext: string;
    university_code: string | null;
    updated_by: string;
    updated_on: string;
  }
  
  export interface DefaultPayment {
    payment_method: string;
    token: string | null;
  }
  
  export interface Social {
    apple: string | null;
    facebook: string | null;
    google: boolean;
  }
  
  export interface CustomerData {
    club1111_earnings: number;
    created_by: string | null;
    created_on: string;
    customer_id: number;
    customer_type: string;
    date_of_birth: string | null;
    default_address_id: number;
    default_payment: DefaultPayment;
    default_store_id: number | null;
    email: string;
    first_name: string;
    id: number;
    lang_preference: string;
    last_name: string;
    legacy_customer_id: number;
    loyalty_card: string | null;
    meal_card: string | null;
    optin_club11_promotions: boolean;
    optin_pp_promotions: boolean;
    phone_extension: string;
    phone_num: string;
    phone_type: string;
    profile_pic: string | null;
    social: Social;
    updated_on: string;
    wallet_id: string;
  }
  
  export interface OperatingHoursDetail {
    day_name: number;
    end_time: string;
    label: string;
    start_time: string;
  }
  
  export interface MinOrderValsCache {
    min_delivery_order_val: number;
    min_pickup_order_val: number;
  }
  
  export interface TaxRuleCache {
    alcohol_rate: number;
    apply_order: number;
    code: string;
    id: string;
    on_total: boolean;
    rate: number;
    sugar_rate: number;
    tax_rule_name: string;
    updated_by: string;
    updated_on: string;
  }
  
  export interface Payments {
    atdoor_credit: boolean;
    atdoor_debit: boolean;
    atdoor_pizzacard: boolean;
    debit_charge_applied: boolean;
    delivery_cashless: boolean;
    online_credit: boolean;
    online_debit: boolean;
    online_max_payment: number;
    online_payments: boolean;
    online_pizzacard: boolean;
    online_tip: boolean;
    pickup_cashless: boolean;
  }
  
  export interface DefaultDeliveryStoreData {
    address: string;
    address_help: string;
    alcohol_age_limit: number;
    alcohol_age_verify: boolean;
    beer_future_offset_mins: number;
    beer_operating_hours_details_cache: OperatingHoursDetail[];
    beer_operating_hours_key: string;
    city: string;
    contactless: boolean;
    contactless_delivery: boolean;
    contactless_pickup: boolean;
    curbside: boolean;
    delivery_amount_cache: number;
    delivery_available: boolean;
    delivery_charge_key: string;
    delivery_guarantee: boolean;
    delivery_guarantee_type: string;
    hand_held_available: boolean;
    id: number;
    image_name: string;
    is_active: boolean;
    is_address_deliverable: boolean;
    is_beer_open: boolean;
    is_express: boolean;
    is_online: boolean;
    is_open: boolean;
    ivr_orders_allowed: boolean;
    latitude: number;
    location_info: string;
    longitude: number;
    market_phone_number: string;
    min_order_vals_cache: MinOrderValsCache;
    operating_hours_details_cache: OperatingHoursDetail[];
    operating_hours_key: string;
    payments: Payments;
    pickup_available: boolean;
    pickup_guarantee: boolean;
    pickup_guarantee_type: string;
    pickup_operating_hours_details_cache: OperatingHoursDetail[];
    pickup_operating_hours_key: string | null;
    postal_code: string;
    price_list_id: number;
    province: string;
    redirect_delivery_to: string | null;
    redirect_pickup_to: string | null;
    site_id: number;
    store_id: number;
    store_message: string;
    store_open: boolean;
    street_name: string;
    street_number: string;
    tax_rules_cache: TaxRuleCache[];
    territory: string;
    timezone_difference: number;
    unit_number: string;
    updated_by: string;
    updated_on: string;
  }
  
  export interface ApiResponse {
    customer_address: CustomerAddress;
    customer_data: CustomerData;
    default_delivery_store_data: DefaultDeliveryStoreData;
    default_pickup_store_data: any;
  }