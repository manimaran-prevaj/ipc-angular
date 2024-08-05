export interface StoreID{
    store_id: number;
}

export interface Item {
    is_customization: number;
    item_code: string;
    item_desc_en: string | null;
    item_desc_fr: string | null;
    item_id: number;
    item_name_en: string;
    item_name_fr: string;
    item_type: string;
    kind: string;
  }

