export interface Product {
    Id: number;
    Name: string;
    CategoryId: number;
    SubCategoryId: number;
    BrandId: number;
    UnitId: number;
    Sku?: string | null;
    MinQuantity?: number | null;
    Quantity: number;
    Description?: string | null;
    Tax?: number | null;
    Discount?: number | null;
    Status: string;
    Price: number;
    Image: string;
    ProductImg?: string | null;
    CreatedBy: number;
}