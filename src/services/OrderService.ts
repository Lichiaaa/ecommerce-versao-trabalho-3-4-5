import { Order } from '../domain/Order';
import { Product } from '../domain/Product';
import { IOrderRepository } from '../repositories/IOrderRepository';

type OrderItemInput = {
    product: Product;
    quantity: number;
};

export class OrderService {
    constructor(
        private orderRepository: IOrderRepository
    ) {}

    createOrder(itens: OrderItemInput[]): Order {
        if (!itens || itens.length === 0) {
            throw new Error('Pedido precisa ter pelo menos um item');
        }

        const order = new Order();

        for (const item of itens) {
            order.addItem(item.product, item.quantity);
        }

        this.orderRepository.save(order);
        return order;
    }
}
