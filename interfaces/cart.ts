import { IvalidSizes } from './';

export interface ICartProduct {
    _id: string;
    image: string;
    price: number;
    size?: IvalidSizes;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex';
    quantity: number;
}