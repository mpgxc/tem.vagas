import { z } from 'zod';

const cpfRegex = /^\d{11}$/;
const cnpjRegex = /^\d{14}$/;

const formatCPF = (document: string) =>
  document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

const formatCNPJ = (document: string) =>
  document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

const cpfSchema = z
  .string()
  .refine((value) => cpfRegex.test(value), {
    message: 'CPF inválido',
  })
  .transform(formatCPF);

const cnpjSchema = z
  .string()
  .refine((value) => cnpjRegex.test(value), {
    message: 'CNPJ inválido',
  })
  .transform(formatCNPJ);

export const Document = z.union([cpfSchema, cnpjSchema]);
