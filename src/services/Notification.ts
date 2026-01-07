import logger from '../lib/logger';
import { Order } from '../domain/Order';
import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async notifyOrderCreated(order: Order): Promise<void> {
    const subject = 'Pedido criado com sucesso ✅';

    const html = `
      <h2>Seu pedido foi criado!</h2>
      <p><strong>Cliente:</strong> ${order.getCustomer()}</p>
      <p><strong>Total:</strong> R$ ${order.calculateTotal().toFixed(2)}</p>
      <p><strong>Itens:</strong> ${order.getItens().length}</p>
    `;

    const result = await this.mailProvider.sendMail({
      to: order.getCustomer(),
      subject,
      html,
    });

    if (result.previewUrl) {
      logger.info('Preview do email (Ethereal)', { previewUrl: result.previewUrl });
    }
  }
}