import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './product.service';
import { Subject } from 'rxjs';
import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { CategoriesService } from '../categories/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  categories: any[] = [];
  dialogVisible = false;
  deleteDialogVisible = false;
  dialogMode: 'add' | 'edit' = 'add';
  currentProduct: any = {};
  productForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      inventoryStatus: ['INSTOCK', Validators.required],
      description: ['', [Validators.minLength(10), Validators.maxLength(200)]],
      image: ['', Validators.required],
      brand: ['', Validators.required],
      seller: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(
        tap((products) => {
          this.products = products.map((product) => ({
            ...product,
            finalPrice: product.price - (product.price * product.discount) / 100 // Final price after discount
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  loadCategories(): void {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.categories = data.filter((category) => category.status === 'ACTIVE');
      });
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  openDialog(mode: 'add' | 'edit', product?: any): void {
    if (this.categories.length === 0) {
      alert('Please add categories first!');
      return;
    }
    this.dialogMode = mode;

    if (mode === 'edit' && product) {
      this.currentProduct = { ...product };
      this.productForm.patchValue({
        ...this.currentProduct
      });
    } else {
      this.currentProduct = {};
      this.productForm.reset({
        name: '',
        category: '',
        price: 0,
        inventoryStatus: 'INSTOCK',
        description: '',
        image: '',
        brand: 'DopeShope',
        seller: 'dopeshope pvt. ltd.'
      });
    }

    this.dialogVisible = true;
  }

  calculateDiscountAndMRP(price: number): { discount: number; mrp: number } {
    let discount = 0;
    if (price < 500) {
      discount = 10; // 10% discount for prices below 500
    } else if (price >= 500 && price < 1000) {
      discount = 20; // 20% discount for prices between 500 and 999
    } else {
      discount = 40; // 40% discount for prices 1000 and above
    }
    const mrp = Math.round(price / (1 - discount / 100));
    return { discount, mrp };
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = { ...this.productForm.value, id: this.currentProduct.id };
    const { discount, mrp } = this.calculateDiscountAndMRP(productData.price);

    productData.discount = discount;
    productData.mrp = mrp;

    if (this.dialogMode === 'edit') {
      this.productService
        .editProduct(productData)
        .pipe(
          tap(() => this.loadProducts()),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.dialogVisible = false;
          console.log('Product updated successfully');
        });
    } else {
      this.productService
        .getNextId()
        .pipe(
          switchMap((nextId) => {
            productData.id = nextId;
            return this.productService.addProduct(productData);
          }),
          tap(() => this.loadProducts())
        )
        .subscribe(() => {
          this.dialogVisible = false;
          console.log('Product added successfully');
        });
    }
  }

  openDeleteDialog(product: any): void {
    this.currentProduct = product;
    this.deleteDialogVisible = true;
  }

  deleteProduct(): void {
    this.productService
      .deleteProduct(this.currentProduct.id)
      .pipe(
        tap(() => this.loadProducts()),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.deleteDialogVisible = false;
      });
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const fileName = file.name;
      this.productForm.patchValue({ image: `assets/images/${fileName}` });
    }
  }

  cancel(): void {
    this.productForm.reset();
    this.dialogVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}