import { OptionalPromise } from '@/common/helpers';
import { Advertisement } from '@/domain/advertisement';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdvertisementRepository {
  constructor(private readonly client: PrismaService) {}

  async create(content: Advertisement): Promise<void> {
    const { customer_id, address, ...data } = content;

    await this.client.advertisement.create({
      data: {
        ...data,
        customer: {
          connect: {
            id: customer_id,
          },
        },
        address: {
          create: address,
        },
      },
    });
  }

  async findBySlug(slug: string): OptionalPromise<Advertisement> {
    const item = await this.client.advertisement.findUnique({
      where: {
        slug,
      },
      include: {
        address: true,
      },
    });

    return (
      item &&
      Advertisement.parse({
        ...item,
        price: item.price.toNumber(),
      })
    );
  }

  async list(options: AdvertisementListOptions): Promise<Advertisement[]> {
    const items = await this.client.advertisement.findMany({
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      include: {
        address: true,
      },
      orderBy: {
        created_at: options.orderBy,
      },
      where: {
        customer_id: options.customerId,
      },
    });

    return items.map((item) =>
      Advertisement.parse({
        ...item,
        price: item.price.toNumber(),
      }),
    );
  }
}

export type AdvertisementListOptions = {
  page: number;
  limit: number;
  orderBy: 'asc' | 'desc';
  customerId?: string;
};
