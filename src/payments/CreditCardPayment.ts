import { IPaymentMethod, PaymentResult } from './IPaymentMethod';

type CreditCardDetails = {
  cardNumber: string;
  cvv: string;
};

export class CreditCardPayment implements IPaymentMethod {
  async process(amount: number, details?: CreditCardDetails): Promise<PaymentResult> {
    if (!details?.cardNumber || !details?.cvv) {
      return { success: false, message: 'Dados do cartão ausentes' };
    }

    // validações simples (simulação)
    if (String(details.cardNumber).length < 12) {
      return { success: false, message: 'Número do cartão inválido' };
    }
    if (String(details.cvv).length !== 3) {
      return { success: false, message: 'CVV inválido' };
    }
    if (amount <= 0) {
      return { success: false, message: 'Valor inválido' };
    }

    return { success: true, transactionId: `cc_${Date.now()}` };
  }
}