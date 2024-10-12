import { Customer } from '@/domain/customer';
import { Injectable } from '@nestjs/common';
import { OptionalPromise } from 'common/helpers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomersRepository {
  constructor(private readonly client: PrismaService) {}

  async create(data: Customer): Promise<void> {
    await this.client.customer.create({
      data,
    });
  }

  async findByEmail(email: string): OptionalPromise<Customer> {
    const item = await this.client.customer.findUnique({
      where: {
        email,
      },
    });

    return item && Customer.parse(item);
  }

  async findUnique({
    id,
    email,
    document,
    phone_number,
  }: Partial<Customer>): OptionalPromise<{
    keys: string[];
    customer: Customer;
  }> {
    const item = await this.client.customer.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            email,
          },
          {
            document,
          },
          {
            phone_number,
          },
        ],
      },
    });

    if (!item) {
      return null;
    }

    const customer = Customer.parse(item);

    const keys = [];

    if (item.id === id) keys.push('id');
    if (item.email === email) keys.push('email');
    if (item.document === document) keys.push('document');
    if (item.phone_number === phone_number) keys.push('phone_number');

    return { customer, keys };
  }
}
