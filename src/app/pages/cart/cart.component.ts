import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/product.model';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common'; 
import { CartItem } from '../../model/cartItem.model';
import { ProductService } from '../../service/product.service';
import { AuthService } from '../../service/auth.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { API_CONSTANTS } from '../../constant/constant';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,MatCardModule,FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: (CartItem & { product?: Product })[] = []; // Merge cartItem with product info

  constructor(private cartService: CartService, private productService: ProductService, private authService: AuthService) {}

  ngOnInit() {
    // const userId = this.authService.getUserId();
    // if (userId) {
    //   this.cartService.getCartItems().subscribe(cartItems => {
    //     this.fetchProductDetails(cartItems);
    //   });
    // }else{
    //   const cartItems = this.cartService.getCartFromLocalStorage();
    //   this.fetchProductDetails(cartItems);
    // }
    const userId = this.authService.getUserId();
    this.cartService.getCartItems().subscribe(cartItems => {
      //console.log("Cart Items:", cartItems); // Debugging log
      if (cartItems.length === 0) {
        this.cartItems = []; // Ensure empty cart reflects immediately
      } else {
        this.fetchProductDetails(cartItems);
      }
    });
  }

  fetchProductDetails(cartItems: CartItem[]) {
    // if (!cartItems || cartItems.length === 0) {
    //   console.warn("Cart is empty, skipping product fetch.");
    //   return;
    // }
    const requests = cartItems.map(cartItem =>
      this.productService.getProductById(cartItem.ProductId)
    );

    // Promise.all(requests).then(products => {
    //   this.cartItems = cartItems.map((cartItem, index) => ({
    //     ...cartItem,
    //     product: products[index]
    //   }));
    // });
    forkJoin(requests).subscribe({
      next: (products) => {
        //console.log('Fetched products:', products); // Log the fetched products
        this.cartItems = cartItems.map((cartItem, index) => ({
          ...cartItem,
          product: products[index]  // Assign product info to cartItem
          
        }));
        //console.log('Updated cartItems:', this.cartItems);  // Log the updated cartItems
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
  removeFromCart(item: CartItem) {
    console.log(item);
    this.cartService.removeFromCart(item);
  }
  clearCart() {
    //this.cartService.clearCart();
    const userId = this.authService.getUserId();
    this.cartService.clearCart(userId);
  }
  getFullImagePath(imagePath?: string): string {
      return `${API_CONSTANTS.BASE_URL}${imagePath}`; // Construct full image URL
    }
}
