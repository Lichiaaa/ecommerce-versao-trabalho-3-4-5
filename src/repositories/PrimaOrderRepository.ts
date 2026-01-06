import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';
import { Order } from '../domain/Order';

export class PrismaOrderRepository implements IOrderRepository {
  private prisma = new PrismaClient();

  async save(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: {
        status: 'PENDING',
        total: order.calculateTotal(),
        freight: order.calculateFreight(),
        subtotal: order.calculateSubtotal(),
      },
    });
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}