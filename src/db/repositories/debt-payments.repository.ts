import { db } from '../schema';
import { DebtPayment } from '../../types';

export class DebtPaymentsRepository {
  async getAll(): Promise<DebtPayment[]> {
    return await db.debtPayments.toArray();
  }

  async getById(id: string): Promise<DebtPayment | undefined> {
    return await db.debtPayments.get(id);
  }

  async getByDebtId(debtId: string): Promise<DebtPayment[]> {
    return await db.debtPayments.where('debtId').equals(debtId).toArray();
  }

  async create(payment: DebtPayment): Promise<string> {
    return await db.debtPayments.add(payment);
  }

  async update(id: string, updates: Partial<DebtPayment>): Promise<number> {
    return await db.debtPayments.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await db.debtPayments.delete(id);
  }

  async deleteByDebtId(debtId: string): Promise<void> {
    const payments = await this.getByDebtId(debtId);
    const paymentIds = payments.map((p) => p.id);
    await db.debtPayments.bulkDelete(paymentIds);
  }

  async deleteAll(): Promise<void> {
    await db.debtPayments.clear();
  }
}

export const debtPaymentsRepository = new DebtPaymentsRepository();
