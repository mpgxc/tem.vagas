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
}
