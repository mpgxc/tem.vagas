import { Customer } from './customer';
import { Document } from './document';

describe('Customer Schema', () => {
  it('should validate a correct customer', () => {
    const validCustomer = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      bio: 'This is a bio',
      document: '12345678901',
      document_type: 'CPF',
      email: 'test@example.com',
      avatar: 'http://example.com/avatar.png',
      full_name: 'John Doe',
      name: 'John',
      password: 'password123',
      phone_number: '11987654321',
      role: 'Corretor',
      created_at: new Date(),
      updated_at: new Date(),
    };

    Document.safeParse = jest.fn().mockReturnValue({ success: true });

    const result = Customer.safeParse(validCustomer);
    expect(result.success).toBe(true);
  });

  it('should invalidate an incorrect customer', () => {
    const invalidCustomer = {
      id: 'invalid-uuid',
      bio: '',
      document: 'invalid-document',
      document_type: 'INVALID',
      email: 'invalid-email',
      avatar: 'invalid-url',
      full_name: '',
      name: '',
      password: '',
      phone_number: 'invalid-phone',
      role: 'InvalidRole',
      created_at: 'invalid-date',
      updated_at: 'invalid-date',
    };

    Document.safeParse = jest.fn().mockReturnValue({ success: false });

    const result = Customer.safeParse(invalidCustomer);
    expect(result.success).toBe(false);
  });

  it('should invalidate a customer with invalid phone number', () => {
    const customerWithInvalidPhone = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      bio: 'This is a bio',
      document: '12345678901',
      document_type: 'CPF',
      email: 'test@example.com',
      avatar: 'http://example.com/avatar.png',
      full_name: 'John Doe',
      name: 'John',
      password: 'password123',
      phone_number: 'invalid-phone',
      role: 'Corretor',
      created_at: new Date(),
      updated_at: new Date(),
    };

    Document.safeParse = jest.fn().mockReturnValue({ success: true });

    const result = Customer.safeParse(customerWithInvalidPhone);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Número de telefone inválido');
  });

  it('should invalidate a customer with invalid document', () => {
    const customerWithInvalidDocument = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      bio: 'This is a bio',
      document: 'invalid-document',
      document_type: 'CPF',
      email: 'test@example.com',
      avatar: 'http://example.com/avatar.png',
      full_name: 'John Doe',
      name: 'John',
      password: 'password123',
      phone_number: '11987654321',
      role: 'Corretor',
      created_at: new Date(),
      updated_at: new Date(),
    };

    Document.safeParse = jest.fn().mockReturnValue({ success: false });

    const result = Customer.safeParse(customerWithInvalidDocument);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Documento inválido');
  });
});
