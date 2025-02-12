export interface Product {
    Id: number;
    Name: string;
    CategoryId: number;
    SubCategoryId: number;
    BrandId: number;
    UnitId: number;
    Sku: string;
    MinQuantity: number;
    Quantity: number;
    Description: string;
    Tax: number;
    Discount: number;
    Status: string;
    Price: number;
    Image: string;
    ProductImg?: string | null;
    CreatedBy: number;
}