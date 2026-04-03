import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, interval } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = 'all';
  searchQuery = '';
  currentSlide = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });

    this.loadProducts();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startAutoSlide(): void {
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % 3;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + 3) % 3;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  loadProducts(): void {
    this.productService.getFilteredProducts(this.selectedCategory, this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.loadProducts();
  }

  onSearch(event: {query: string, category: string}): void {
    this.searchQuery = event.query;
    this.selectedCategory = event.category;
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter(p => p.category === categoryId);
  }

  getCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategory);
    return category ? category.name : 'All Products';
  }

  getIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      'grid': 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z',
      'devices': 'M23 3h-6.19C15.65 1.84 13.69 0 11 0S6.35 1.84 5.19 3H1c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H2V5h20v14z',
      'checkroom': 'M21.6 18.2L13 11.75v-.91a3.496 3.496 0 0 0-.18-6.75 3.5 3.5 0 0 0 3.32 3.25h.58c1.25 0 2.31.74 2.75 1.85L21.6 18.2zM12 21.5c-1.38 0-2.5-1.12-2.5-2.5h5c0 1.38-1.12 2.5-2.5 2.5z',
      'home': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      'sports': 'M11.23 6.5L6.5 11.23 8.41 13.15 11.23 10.33V18h1.5v-7.67l2.82 2.82 1.91-1.91-5.5-5.5 5.5-5.5-1.91-1.91-2.82 2.82V3h-1.5v3.5z',
      'menu_book': 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z'
    };
    return icons[icon] || icons['grid'];
  }
}
