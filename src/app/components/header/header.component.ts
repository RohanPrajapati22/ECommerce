import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() searchQuery = new EventEmitter<{query: string, category: string}>();
  
  searchTerm = '';
  selectedCategory = 'all';
  categories: Category[] = [];
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    this.productService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  onSearch(): void {
    this.searchQuery.emit({ query: this.searchTerm, category: this.selectedCategory });
  }
}
