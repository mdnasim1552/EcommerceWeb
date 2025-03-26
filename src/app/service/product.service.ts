import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseModel } from '../model/api-response.model';
import { Observable, tap } from 'rxjs';
import { Product } from '../model/product.model';
import { API_CONSTANTS } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PRODUCT_LIST}`
  constructor(private http: HttpClient) { }
  getProducts(): Observable<ApiResponseModel<Product[]>> {
    return this.http.get<ApiResponseModel<Product[]>>(this.apiUrl);
  }
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${API_CONSTANTS.BASE_URL}/api/Product/GetProductById/${productId}`).pipe(
      tap(product => {
        //console.log('Product fetched for ID:', productId, product); // Log the individual product
      })
    );
  }
}
