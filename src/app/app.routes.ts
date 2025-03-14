import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { CustomerCartComponent } from './pages/customer-cart/customer-cart.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';



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
        path: 'customerCart',
        title: 'Cart',
        component: CustomerCartComponent
    }
];
