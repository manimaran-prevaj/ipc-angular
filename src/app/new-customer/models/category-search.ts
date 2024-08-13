export interface StoreID{
    store_id: number;
}

export interface Image {
    is_full_width: boolean;
    name: Record<string, unknown>; // Assuming name can be any object
  }
  
  export interface UiMetadata {
    background_color: string;
    deal: string;
    end_color: string;
    is_default: boolean;
    is_group_ordering: boolean;
    is_horizontal: boolean;
    size: string;
    start_color: string;
    style: string;
    text_color: string;
  }
  
  export interface Category {
    description: string;
    id: string;
    image: Image;
    name: string;
    parent_id: string;
    products_available: boolean;
    seo_title: string;
    sequence: Record<string, unknown>; // Assuming sequence can be any object
    ui_metadata: UiMetadata;
  }