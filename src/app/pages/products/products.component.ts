import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';
import { API_CONSTANTS } from '../../constant/constant';
import { NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatGridListModule,MatInputModule,MatFormFieldModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  quantities: { [productId: number]: number } = {}; // Store quantity separately
  gridCols: number = 6;
  router = inject(Router);
  constructor(private productService: ProductService, private breakpointObserver: BreakpointObserver,private cartService: CartService,private authService:AuthService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.breakpointObserver.observe([
      Breakpoints.XSmall, // Phones
      Breakpoints.Small, // Tablets
      Breakpoints.Medium, // Small Laptops
      Breakpoints.Large, // Desktops
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.gridCols = 1; // Mobile
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.gridCols = 2; // Tablets
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.gridCols = 3; // Small laptops
      } else {
        this.gridCols = 6; // Large screens
      }
    });
  }

  loadProducts(): void {
  //   this.productService.getProducts().subscribe(response => {
  //     this.products = response.data;
  //     this.products.forEach(p => this.quantities[p.Id] = 1); // Default quantity = 1 for each product

  //   }
  //   ,
  //   error => {
  //     console.log(error.status);
  //     this.router.navigate(['/login']);
  //     // if (error.status === 401) {
  //     //   console.log('Unauthorized, please log in again');
  //     //   // Redirect to login page or handle token refresh here
  //     // } else {
  //     //   console.log('Error:', error);
  //     // }
  //   }
  // );
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.products.forEach(p => this.quantities[p.Id] = 1); // Default quantity = 1 for each product
      },
      error: (err) => {
        console.log(err.status);
        this.router.navigate(['/login']);
      }
    });
  }
  addToCart(product:Product) {
    //this.cartService.addToCart(product);
    const userId = this.authService.getUserId(); // Get logged-in user ID (or null for guests)
    const quantity = this.quantities[product.Id] || 1; // Get selected quantity
    if (quantity > 0) {
      this.cartService.addToCart(userId, product.Id, quantity);
    }
  }
  getFullImagePath(imagePath: string): string {
    return `${API_CONSTANTS.BASE_URL}${imagePath}`; // Construct full image URL
  }
}
