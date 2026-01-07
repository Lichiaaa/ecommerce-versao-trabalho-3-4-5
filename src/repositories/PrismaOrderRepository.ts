import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';
import { Order } from '../domain/Order';

export class PrismaOrderRepository implements IOrderRepository {
  private prisma = new PrismaClient();

  async save(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: {
        customer: order.getCustomer(),
        items: JSON.stringify(order.getItens()), // vira string
        total: order.calculateTotal(),
        status: 'PENDING',
      },
    });
  }


  async updateStatus(orderId: number, status: string): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}