import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'assets/data/products.json';
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  
  categories$ = this.categoriesSubject.asObservable();
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<{categories: Category[]; products: Product[]}>(this.dataUrl)
      .subscribe(data => {
        this.categoriesSubject.next(data.categories);
        this.productsSubject.next(data.products);
      });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => 
        categoryId === 'all' 
          ? products 
          : products.filter(p => p.category === categoryId)
      )
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.products$.pipe(
      map(products => 
        products.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
        )
      )
    );
  }

  getFilteredProducts(categoryId: string, searchQuery: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => {
        let filtered = products;
        
        if (categoryId !== 'all') {
          filtered = filtered.filter(p => p.category === categoryId);
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
