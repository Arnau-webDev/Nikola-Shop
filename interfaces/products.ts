export interface IProduct {
    _id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: IvalidSizes[];
    slug: string;
    tags: string[];
    title: string;
    type: IvalidTypes;
    gender: 'men'|'women'|'kid'|'unisex';
    createdAt: string;
    updatedAt: string;
}

export type IvalidSizes = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IvalidTypes = 'shirts'|'pants'|'hoodies'|'hats';