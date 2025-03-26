import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { API_CONSTANTS } from '../constant/constant';
import { CartItem } from '../model/cartItem.model';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../model/product.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = this.getCartFromLocalStorage();
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cart);

  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: object,private authService: AuthService) {
    this.loadCartItems();
  }

  // Add product to cart (Handles both guest & logged-in users)
  addToCart(userId: number | null, productId: number, quantity: number): void {
    if (quantity <= 0) return; // Simply exit the function
    if (userId) {
      // User is logged in → Store in database
      this.http.post(`${API_CONSTANTS.BASE_URL}/api/Cart/add-to-cart`, { 
        userId, productId, quantity 
      }).subscribe(() => {
        this.updateCartState(userId);
      });
    } else {
      // Guest User → Store in Local Storage
      let cart = this.getCartFromLocalStorage();
      const existingItem = cart.find(item => item.ProductId === productId);

      if (existingItem) {
        existingItem.Quantity += quantity;
      } else {
        cart.push({CartId:0, ProductId:productId, Quantity:quantity });
      }

      this.saveCartToLocalStorage(cart);
      this.cartSubject.next(cart);
    }
  }
  // Save cart data locally
  private saveCartToLocalStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Get local cart
  getCartFromLocalStorage(): CartItem[] {
    // if (this.authService.BrowserEnvironment()) {
    //   return JSON.parse(localStorage.getItem('cart') || '[]');
    // }
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return []
  }
  private loadCartItems():void{
    this.authService.isAuthenticated().subscribe(status => {
      if (status) {
        const userId = this.authService.getUserId(); // Ensure userId is available
        if (userId) {
          this.syncLocalCartToApi(userId);
        }
      }else{
        this.cartSubject.next(this.getCartFromLocalStorage());
      }
    });
  }
  // Get cart items as observable
  getCartItems() {

    return this.cartSubject.asObservable();
  }

  // Sync local cart to API on login
  syncLocalCartToApi(userId: number) {
    const localCart = this.getCartFromLocalStorage();
    if (localCart.length === 0) {
      this.updateCartState(userId);
    }else{
      this.http.post(`${API_CONSTANTS.BASE_URL}/api/Cart/sync-cart`, { userId, cart: localCart })
      .subscribe(() => {
        localStorage.removeItem('cart'); // Clear local storage after syncing
        this.updateCartState(userId);
      });
    }   
  }

  // Fetch updated cart from API
  updateCartState(userId: number | null) {
    this.http.get<CartItem[]>(`${API_CONSTANTS.BASE_URL}/api/Cart/get-cart/${userId}`).subscribe(cart => {
      this.cartSubject.next(cart);
    });
  }

  // Clear the cart
  clearCart(userId: number | null) {
    // localStorage.removeItem('cart');
    // this.cartSubject.next([]);
    if (userId) {
      // If user is logged in, clear cart via API
      this.http.delete(`${API_CONSTANTS.BASE_URL}/api/Cart/clear/${userId}`).subscribe(() => {
        this.cartSubject.next([]); // Notify subscribers about the empty cart
      });
    } else {
      // Clear cart for guest users
      localStorage.removeItem('cart');
      this.cartSubject.next([]); // Notify subscribers
    }
    // localStorage.removeItem('cart'); // Clear local storage
    // this.cart = []; // Clear in-memory cart
    // this.cartSubject.next(this.cart); // Notify subscribers
  }
  removeFromCart(item: CartItem & { product?: Product }){
    if (item.CartId === 0) {
      // Remove from localStorage based on ProductId
      let cart = this.getCartFromLocalStorage();
      cart = cart.filter(cartItem => cartItem.ProductId !== item.ProductId);
      this.saveCartToLocalStorage(cart);
      this.cartSubject.next(cart);
    } else {
      // Remove from API based on CartId
      let userId = this.authService.getUserId(); // Get logged-in user ID (or null for guests)
      this.http.delete(`${API_CONSTANTS.BASE_URL}/api/Cart/remove/${item.CartId}`)
        .subscribe(() => {
          this.updateCartState(userId); // Refresh cart data
        });
    }
  }
}
