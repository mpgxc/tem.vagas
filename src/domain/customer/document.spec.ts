import { z } from 'zod';
import { Document } from './document';

describe('Document Schema', () => {
  it('should validate and format a valid CPF', () => {
    const validCPF = '12345678909';
    const result = Document.parse(validCPF);
    expect(result).toBe('123.456.789-09');
  });

  it('should throw an error for an invalid CPF', () => {
    const invalidCPF = '1234567890';
    expect(() => Document.parse(invalidCPF)).toThrow(z.ZodError);
  });

  it('should validate and format a valid CNPJ', () => {
    const validCNPJ = '12345678000195';
    const result = Document.parse(validCNPJ);
    expect(result).toBe('12.345.678/0001-95');
  });

  it('should throw an error for an invalid CNPJ', () => {
    const invalidCNPJ = '1234567800019';
    expect(() => Document.parse(invalidCNPJ)).toThrow(z.ZodError);
  });
});
