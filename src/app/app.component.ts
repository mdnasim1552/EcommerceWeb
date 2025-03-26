import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';
import { CartComponent } from './pages/cart/cart.component';
import { CartService } from './service/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, CartComponent, MatBadgeModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'EcommerceWeb';
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router,private cartService:CartService) {}
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(status => {
      this.isLoggedIn = status;  // Now updates instantly and persists after reload
      if (this.isLoggedIn) {
        const userId = this.authService.getUserId(); // Ensure userId is available
        if (userId) {
          this.cartService.syncLocalCartToApi(userId);
        }
      }
    });
  }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  toggleCart() {

  }
}
