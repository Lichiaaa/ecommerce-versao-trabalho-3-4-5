import { Order } from '../domain/Order';
import { Product } from '../domain/Product';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IPaymentMethod } from '../payments/IPaymentMethod';

import { NotificationService } from './Notification';

type OrderItemInput = {
  product: Product;
  quantity: number;
};

export class OrderService {
  constructor(private orderRepository: IOrderRepository, private notificationService: NotificationService) {}

  async createOrder(customer: string, itens: OrderItemInput[], payment: IPaymentMethod, paymentDetails?: any): Promise<Order> {
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

    const result = await payment.process(order.calculateTotal(), paymentDetails);
    if (!result.success) {
      throw new Error(result.message ?? 'Pagamento recusado');
    }

    await this.orderRepository.save(order);

    await this.notificationService.notifyOrderCreated(order);

    return order;
  }
}
