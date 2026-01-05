import { Product } from './Product';

export class PhysicalProduct extends Product{
    private weight: number;
    private dimensions: number;

    constructor(id: string, name: string, price: number, weight: number, dimensions: number){
        super(id, name, price);
        this.weight = weight;
        this.dimensions = dimensions;
    }

    calculaFrete(): number {
        return 10;
    }
}