export abstract class Product{
    protected id: string;
    protected name: string;
    protected price: number;

    constructor(id: string, name: string, price: number){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    getId(): string{
        return this.id;
    }

    getName(): string{
        return this.name;
    }

    getPrice(): number{
        return this.price;
    }

    abstract calculateFreight(): number;
}