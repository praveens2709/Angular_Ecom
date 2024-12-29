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
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(tap((data) => (this.products = data)), takeUntil(this.destroy$))
      .subscribe();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data.filter(category => category.status === 'ACTIVE');
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
      this.productForm.setValue({
        name: this.currentProduct.name,
        category: this.currentProduct.category,
        price: this.currentProduct.price,
        inventoryStatus: this.currentProduct.inventoryStatus,
        image: this.currentProduct.image || ''
      });
    } else {
      this.currentProduct = {
        name: '',
        category: '',
        price: 0,
        inventoryStatus: 'INSTOCK',
        image: ''
      };
      this.productForm.reset({
        name: '',
        category: '',
        price: 0,
        inventoryStatus: 'INSTOCK',
        image: ''
      });
    }

    this.dialogVisible = true;
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const fileName = file.name;
      this.productForm.patchValue({
        image: `assets/images/${fileName}`
      });
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = { ...this.productForm.value, id: this.currentProduct.id };

    if (this.dialogMode === 'edit') {
      this.productService
        .editProduct(productData)
        .pipe(
          tap(() => this.loadProducts()),
          takeUntil(this.destroy$)
        )
        .subscribe(
          () => {
            this.dialogVisible = false;
            console.log('Product updated successfully');
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel(): void {
    this.productForm.reset({
      name: '',
      category: '',
      price: 0,
      inventoryStatus: 'INSTOCK',
      image: ''
    });
  
    this.dialogVisible = false;
  }  
}
