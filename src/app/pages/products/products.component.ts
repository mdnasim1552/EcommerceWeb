import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';
import { API_CONSTANTS } from '../../constant/constant';
import { NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, NgOptimizedImage, MatGridListModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  gridCols: number = 6;
  constructor(private productService: ProductService, private breakpointObserver: BreakpointObserver) { }

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
    this.productService.getProducts().subscribe(response => {
      this.products = response.data;
    });
  }
  addToCart() {

  }
  getFullImagePath(imagePath: string): string {
    return `${API_CONSTANTS.BASE_URL}${imagePath}`; // Construct full image URL
  }
}
