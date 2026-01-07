import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { ProductFactory } from '../domain/ProductFactory';

import { IPaymentMethod } from '../payments/IPaymentMethod';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { PixPayment } from '../payments/PixPayment';

import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { NotificationService } from '../services/Notification';

const prisma = new PrismaClient();

const mailProvider = new EtherealMailProvider();
const notificationService = new NotificationService(mailProvider);

const orderRepository = new PrismaOrderRepository();
const orderService = new OrderService(orderRepository, notificationService);

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body as {
        customer?: string;
        items?: Array<{ productId: number; quantity: number }>;
        paymentMethod?: string;
        paymentDetails?: any;
      };

      if (!customer || customer.trim().length === 0) {
        return res.status(400).json({ error: 'customer é obrigatório' });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'itens é obrigatório e deve ter ao menos 1 item' });
      }
      if (!paymentMethod) {
        return res.status(400).json({ error: 'paymentMethod é obrigatório' });
      }

      let payment: IPaymentMethod;
      if (paymentMethod === 'credit_card') {
        payment = new CreditCardPayment();
      }
      else if (paymentMethod === 'pix') {
        payment = new PixPayment();
      }
      else {
        return res.status(400).json({ error: `Método de pagamento inválido: ${paymentMethod}` });
      }

      const ids = items.map(i => i.productId);
      const productsData = await prisma.product.findMany({
        where: { id: { in: ids } },
      });

      const productMap = new Map<number, (typeof productsData)[number]>();
      for (const p of productsData) productMap.set(p.id, p);

      const serviceItems = items.map(i => {
        const productData = productMap.get(i.productId);
        if (!productData) throw new Error(`Produto não encontrado: ${i.productId}`);

        return {
          product: ProductFactory.createProduct(productData),
          quantity: i.quantity,
        };
      });

      const order = await orderService.createOrder(customer, serviceItems, payment, paymentDetails);

      return res.status(201).json({
        customer: order.getCustomer(),
        items: order.getItens(), // vai como objeto, no banco ele vira JSON string
        subtotal: order.calculateSubtotal(),
        freight: order.calculateFreight(),
        total: order.calculateTotal(),
        status: 'PENDING',
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message ?? 'Erro interno' });
    }
  }
}