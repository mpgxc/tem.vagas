import { v7 as uuid } from 'uuid';
import { Address, Advertisement } from './advertisement';

describe('Advertisement Schema', () => {
  it('should create a valid Advertisement object', () => {
    const ad = Advertisement.parse({
      title: 'Test Ad',
      description: 'This is a test advertisement',
      price: 1000,
      customer_id: uuid(),
      address: {
        city: 'Test City',
        state: 'Test State',
        street: 'Test Street',
        number: '123',
        zip_code: '12345',
      },
    });

    expect(ad).toHaveProperty('id');
    expect(ad.title).toBe('Test Ad');
    expect(ad.description).toBe('This is a test advertisement');
    expect(ad.price).toBe(1000);
    expect(ad.bedrooms).toBe(0);
    expect(ad.bathrooms).toBe(0);
    expect(ad.garage).toBe(0);
    expect(ad.area).toBe(0);
    expect(ad.slug).toBe('');
    expect(ad.is_furnished).toBe(false);
    expect(ad.image_urls).toEqual([]);
    expect(ad.status).toBe('Disponivel');
    expect(ad.customer_id).toBeTruthy();
    expect(ad.address.city).toBe('Test City');
    expect(ad.address.state).toBe('Test State');
    expect(ad.address.street).toBe('Test Street');
    expect(ad.address.number).toBe('123');
    expect(ad.address.zip_code).toBe('12345');
  });

  it('should fail validation for missing required fields', () => {
    expect(() => Advertisement.parse({})).toThrow();
  });

  it('should fail validation for invalid price', () => {
    expect(() =>
      Advertisement.parse({
        title: 'Test Ad',
        description: 'This is a test advertisement',
        price: -1000,
        customer_id: uuid(),
        address: {
          city: 'Test City',
          state: 'Test State',
          street: 'Test Street',
          number: '123',
          zip_code: '12345',
        },
      }),
    ).toThrow();
  });
});

describe('Address Schema', () => {
  it('should create a valid Address object', () => {
    const address = Address.parse({
      city: 'Test City',
      state: 'Test State',
      street: 'Test Street',
      number: '123',
      zip_code: '12345',
    });

    expect(address).toHaveProperty('id');
    expect(address.city).toBe('Test City');
    expect(address.state).toBe('Test State');
    expect(address.street).toBe('Test Street');
    expect(address.number).toBe('123');
    expect(address.zip_code).toBe('12345');
    expect(address.latitude).toBe(0.0);
    expect(address.longitude).toBe(0.0);
  });

  it('should fail validation for missing required fields', () => {
    expect(() => Address.parse({})).toThrow();
  });
});
