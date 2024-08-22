

export interface ProductListResponse {
    category: Category;
    products: Product[];
}

export interface Category {
    description: string;
    id: number;
    image: Image;
    name: string;
    parent_id: number;
    products_available: boolean;
    seo_title: string;
    sequence: number;
    ui_metadata: UIMetadata;
}

export interface Image {
    is_full_width: boolean;
    name: string;
}

export interface UIMetadata {
    background_color: string;
    deal: string | null;
    end_color: string;
    is_default: boolean;
    is_group_ordering: boolean;
    is_horizontal: boolean;
    size: string;
    start_color: string;
    style: string;
    text_color: string;
}

export interface Product {
    allergens: boolean;
    allow_add_to_cart: boolean;
    allow_customization: boolean;
    allow_qty_selection: boolean;
    allow_quick_add: boolean;
    cal_text: string;
    description: string;
    image: string;
    kind: string;
    legal_text: string | null;
    marketing_badge: MarketingBadge | null;
    name: string;
    price_text: PriceText;
    product_id: string;
    product_tag: string | null;
    seo_title: string;
    sequence: number;
    sub_title: string;
}

export interface MarketingBadge {
    color: string;
    font_key: string;
    text: string;
}

export interface PriceText {
    label: string;
    price_value: number;
}