// src/repositories/IOrderRepository.ts
import { Order } from '../domain/Order';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  updateStatus(orderId: string, status: string): Promise<void>;
}
