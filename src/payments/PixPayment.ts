import { IPaymentMethod, PaymentResult } from './IPaymentMethod';

export class PixPayment implements IPaymentMethod {
  async process(amount: number): Promise<PaymentResult> {
    if (amount <= 0) {
      return { success: false, message: 'Valor inválido' };
    }

    // simulação de pix instantâneo
    return { success: true, transactionId: `pix_${Date.now()}` };
  }
}