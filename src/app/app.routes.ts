import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { CustomerCartComponent } from './pages/customer-cart/customer-cart.component';
import { LoginComponent } from './pages/auth/login/login.component';



export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'product',
        title: 'Home page',
        component: ProductsComponent
    },
    {
        path: 'customerCart',
        title: 'Cart',
        component: CustomerCartComponent
    }
];
