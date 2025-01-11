import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Admin/Modules/products/product.service';
import { CategoriesService } from '../../../Admin/Modules/categories/categories.service';

@Component({
  selector: 'app-product',
  standalone: false,
  
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  cartCount: number = 5;
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];
  selectedCategory: string | null = null;
  priceFilters: { min: number; max: number }[] = [
    { min: 0, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 5000 },
    { min: 5000, max: 10000 },
    { min: 10000, max: Infinity },
  ];
  selectedPriceFilter: { min: number; max: number } | null = null;
  sortOptions = [
    { label: 'Low to High', value: 'low-to-high' },
    { label: 'High to Low', value: 'high-to-low' },
  ];
  selectedSort: string = 'low-to-high';

  rowsPerPage: number = 12;
  currentPage: number = 0;
  totalProducts: number = 0;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
      this.totalProducts = this.filteredProducts.length;
      this.updatePaginatedProducts();
    });
  }

  fetchCategories(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data.filter((category) => category.status === 'ACTIVE');
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products
      .filter((product) => {
        return (
          (!this.selectedCategory || product.category === this.selectedCategory) &&
          (!this.selectedPriceFilter ||
            (product.price >= this.selectedPriceFilter.min &&
              product.price <= this.selectedPriceFilter.max))
        );
      })
      .sort((a, b) => {
        return this.selectedSort === 'low-to-high'
          ? a.price - b.price
          : b.price - a.price;
      });

    this.totalProducts = this.filteredProducts.length;
    this.currentPage = 0;
    this.updatePaginatedProducts();
  }

  getDisplayedRange(): string {
    if (this.totalProducts === 0) {
      return 'Showing 0 of 0 results';
    }
  
    const start = this.currentPage * this.rowsPerPage + 1;
    const end = Math.min((this.currentPage + 1) * this.rowsPerPage, this.totalProducts);
    return `Showing ${start}-${end} of ${this.totalProducts} results`;
  }  

  updatePaginatedProducts(): void {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.updatePaginatedProducts();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  selectPriceFilter(filter: { min: number; max: number }): void {
    this.selectedPriceFilter = filter;
    this.applyFilters();
  }
}