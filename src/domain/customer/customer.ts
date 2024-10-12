import { v7 as uuid } from 'uuid';
import validator from 'validator';
import { z } from 'zod';
import { Document } from './document';

export type CustomerRoles =
  | 'Corretor'
  | 'Proprietario'
  | 'Imobiliaria'
  | 'Inquilino'
  | 'Administrador';

export const Customer = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuid()),
  bio: z.string(),
  document: z.string().refine((value) => Document.safeParse(value).success, {
    message: 'Documento inválido',
  }),
  document_type: z.enum(['CPF', 'CNPJ']),
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  full_name: z.string(),
  name: z.string(),
  password: z.string(),
  phone_number: z
    .string()
    .refine((value) => validator.isMobilePhone(value, 'pt-BR'), {
      message: 'Número de telefone inválido',
    }),
  role: z.enum([
    'Corretor',
    'Proprietario',
    'Imobiliaria',
    'Inquilino',
    'Administrador',
  ]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Customer = z.infer<typeof Customer>;
