import { Order } from '../domain/Order';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  updateStatus(orderId: number, status: string): Promise<void>;
}
