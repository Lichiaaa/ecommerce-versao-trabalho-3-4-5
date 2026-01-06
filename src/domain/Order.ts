import { Product } from './Product';

type OrderItem = { product: Product; quantity: number };

export class Order{
    private itens: OrderItem[] = [];

    addItem(product: Product, quantity: number): void {
        if (quantity <= 0) throw new Error('Quantidade inválida');
        this.itens.push({ product, quantity });
    }

    calculateSubtotal(): number {
        return this.itens.reduce((sum, i) => sum + i.product.getPrice() * i.quantity, 0);
    }

    calculateFreight(): number {
        return this.itens.reduce((sum, i) => sum + i.product.calculateFreight(), 0);
    }

    calculateTotal(): number {
        return this.calculateSubtotal() + this.calculateFreight();
    }
}
