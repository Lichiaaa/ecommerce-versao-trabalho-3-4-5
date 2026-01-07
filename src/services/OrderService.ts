import { Order } from '../domain/Order';
import { Product } from '../domain/Product';
import { IOrderRepository } from '../repositories/IOrderRepository';

type OrderItemInput = {
  product: Product;
  quantity: number;
};

export class OrderService {
  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(customer: string, itens: OrderItemInput[]): Promise<Order> {
    if (!customer || customer.trim().length === 0) {
      throw new Error('Customer inválido');
    }
    if (!itens || itens.length === 0) {
      throw new Error('Pedido precisa ter pelo menos um item');
    }

    const order = new Order(customer);

    for (const item of itens) {
      order.addItem(item.product, item.quantity);
    }

    await this.orderRepository.save(order);

    return order;
  }
}
