import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
  public categoryName = '';
  public searchQuery = '';
  public filteredProducts: any[] = [];
  public productsRows = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: any; products: any }
  ) {}

  ngOnInit(): void {
    this.categoryName = this.data?.products?.category?.name || 'Category Name';
    if (Array.isArray(this.data.products?.products)) {
      this.filteredProducts = this.data.products.products;
      this.productsRows = Math.ceil(this.filteredProducts.length/4);
    } else {
      console.error('Expected products to be an array:', this.data.products);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.data.products.products.filter((product: any) =>
      product.name.toLowerCase().includes(query)
    );
  }

  getPriceForSize(product: any): string {
    if (product.price_text && product.price_text.price_value) {
      return `$${product.price_text.price_value.toFixed(2)}`;
    }
    return '';
  }
}