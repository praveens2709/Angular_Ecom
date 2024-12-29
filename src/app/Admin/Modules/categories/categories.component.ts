import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { MessageService } from 'primeng/api';

interface Category {
  id?: string;
  name: string;
  status: string;
  productCount: number;
}

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  currentCategory: Category = { name: '', status: 'ACTIVE', productCount: 0 };
  dialogVisible = false;
  deleteDialogVisible = false;
  dialogMode = 'add';

  constructor(
    private categoryService: CategoriesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      categories.forEach((category) => {
        this.categoryService.getCategoryProductCount(category.name).subscribe((count) => {
          category.productCount = count; // Add product count
        });
      });
      this.categories = categories;
    });
  }

  openDialog(mode: string, category?: Category) {
    this.dialogMode = mode;
    if (mode === 'edit' && category) {
      this.currentCategory = { ...category };
    } else {
      this.currentCategory = { name: '', status: 'ACTIVE', productCount: 0 };
    }
    this.dialogVisible = true;
  }

  saveCategory() {
    if (this.dialogMode === 'add') {
      this.categoryService.addCategory(this.currentCategory).subscribe((category) => {
        this.categories.push(category);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully' });
        this.dialogVisible = false;
      });
    } else if (this.dialogMode === 'edit') {
      this.categoryService.updateCategory(this.currentCategory.id!, this.currentCategory).subscribe(() => {
        const index = this.categories.findIndex((cat) => cat.id === this.currentCategory.id);
        this.categories[index] = this.currentCategory;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
        this.dialogVisible = false;
      });
    }
  }

  openDeleteDialog(category: Category) {
    this.currentCategory = { ...category };
    this.deleteDialogVisible = true;
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter((cat) => cat.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
      this.deleteDialogVisible = false;
    });
  }

  getSeverity(status: string): 'success' | 'danger' | 'warning' | 'info' | 'secondary' | undefined {
    if (status === 'ACTIVE') {
      return 'success';
    } else if (status === 'INACTIVE') {
      return 'danger';
    } else if (status === 'PENDING') {
      return 'warning';
    }
    return 'secondary';
  }
}
