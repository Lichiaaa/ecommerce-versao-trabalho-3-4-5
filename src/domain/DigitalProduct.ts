import { Product } from './Product';

export class DigitalProduct extends Product{
    constructor(id: string, name: string, price: number){
        super(id, name, price);
    }

    calculateFreight(): number {
        return 0;
    }
}