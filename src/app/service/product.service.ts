import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseModel } from '../model/api-response.model';
import { Product } from '../model/Product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = "https://localhost:7289/api/Product/GetProductList"
  constructor(private http: HttpClient) { }
  getProducts(): Observable<ApiResponseModel<Product[]>> {
    return this.http.get<ApiResponseModel<Product[]>>(this.apiUrl);
  }
}
