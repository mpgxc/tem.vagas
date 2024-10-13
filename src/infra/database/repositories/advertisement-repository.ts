import { OptionalPromise } from '@/common/helpers';
import { Advertisement } from '@/domain/advertisement';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdvertisementRepository {
  constructor(private readonly client: PrismaService) {}

  async create(data: Advertisement): Promise<void> {
    await this.client.advertisement.create({
      data: {
        ...data,
        address: {
          create: data.address,
        },
      },
    });
  }

  async findBySlug(slug: string): OptionalPromise<any> {
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
}
