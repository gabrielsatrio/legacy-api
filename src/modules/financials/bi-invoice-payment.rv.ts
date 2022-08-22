import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { InvoicePaymentInput } from './bi-invoice-payment.in';
import { InvoicePayment } from './entities/bi-invoice-payment';
import { InvoicePaymentView } from './entities/bi-invoice-payment.vw';

@Resolver(InvoicePayment)
export class InvoicePaymentResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkInvoicePaymentExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getInvoicePayment(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [InvoicePaymentView])
  @UseMiddleware(isAuth)
  async getAllInvoicePayment(): Promise<InvoicePaymentView[] | undefined> {
    try {
      return await InvoicePayment.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [InvoicePaymentView], { nullable: true })
  @UseMiddleware(isAuth)
  async getInvoicePaymentByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<InvoicePaymentView[] | undefined> {
    try {
      return await InvoicePaymentView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => InvoicePaymentView, { nullable: true })
  @UseMiddleware(isAuth)
  async getInvoicePayment(
    @Arg('id', () => Int) id: number
  ): Promise<InvoicePaymentView | null> {
    try {
      return await InvoicePaymentView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InvoicePayment)
  @UseMiddleware(isAuth)
  async createInvoicePayment(
    @Arg('input') input: InvoicePaymentInput
  ): Promise<InvoicePayment | undefined> {
    try {
      const existingData = await InvoicePayment.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = InvoicePayment.create({
        ...input
      });
      const result = await InvoicePayment.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InvoicePayment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInvoicePayment(
    @Arg('input') input: InvoicePaymentInput
  ): Promise<InvoicePayment | undefined> {
    try {
      const data = await InvoicePayment.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      InvoicePayment.merge(data, { ...input });
      const result = await InvoicePayment.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InvoicePayment)
  @UseMiddleware(isAuth)
  async deleteInvoicePayment(
    @Arg('id', () => Int) id: number
  ): Promise<InvoicePayment> {
    try {
      const data = await InvoicePayment.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await InvoicePayment.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
