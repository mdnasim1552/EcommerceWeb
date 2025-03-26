import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { CartComponent } from './pages/cart/cart.component';



export const routes: Routes = [
    {
        path: '',
        redirectTo: 'product',
        pathMatch: 'full'
    },
    {
        path: 'product',
        title: 'Home page',
        component: ProductsComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registration',
        component: RegistrationComponent
    },
    {
        path: 'Cart',
        title: 'Cart',
        component: CartComponent
    }
];
