import { v7 as uuid } from 'uuid';
import { z } from 'zod';

export const Address = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuid()),
  city: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.string(),
  zip_code: z.string(),
  latitude: z.number().default(0.0),
  longitude: z.number().default(0.0),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const author = z.object({
  name: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  avatar: z.string().url(),
});

export const Advertisement = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuid()),
  title: z.string(),
  description: z.string(),
  location: z.string().default(''),
  price: z.number().positive(),
  bedrooms: z.number().gte(0).default(0),
  bathrooms: z.number().gte(0).default(0),
  garage: z.number().gte(0).default(0),
  area: z.number().gte(0).default(0),
  slug: z.string().default(''),
  is_furnished: z.boolean().default(false),
  image_urls: z.array(z.string()).default([]),
  status: z
    .enum(['Disponivel', 'Alugado', 'Pausado', 'Vendido', 'Expirado'])
    .default('Disponivel'),
  customer_id: z.string().uuid(),
  address: Address,
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Advertisement = z.infer<typeof Advertisement>;

export type Address = z.infer<typeof Address>;
