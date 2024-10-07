import { Entity, entityFactory } from 'common/helpers';

export type Profile = {
  customerId: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  avatar: string;
};

export type CreateProfileInput = Profile;

export type ProfileEntity = Entity<Profile> & {
  PK: `CUSTOMER-${string}`;
  SK: `PROFILE`;
  Email: string;
};

export const createCustomerProfile = (
  content: CreateProfileInput,
): ProfileEntity =>
  entityFactory<ProfileEntity>({
    PK: `CUSTOMER-${content.customerId}`,
    SK: `PROFILE`,
    Email: content.email,
    Content: content,
  });
