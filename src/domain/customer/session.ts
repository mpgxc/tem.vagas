import { Entity, entityFactory } from 'common/helpers';
import { randomUUID } from 'crypto';

/**
 * Salvar estes dados com TTL de 1 hora
 */
export type Session = {
  email: string;
  token: string;
  expiresIn: number;
};

export type CreateSessionInput = Session;

export type SessionEntity = Entity<Session> & {
  PK: `CUSTOMER-${string}`;
  SK: `SESSION`;
  Email: string;
};

export const createSession = (o: CreateSessionInput): SessionEntity =>
  entityFactory<SessionEntity>({
    PK: `CUSTOMER-${randomUUID()}`,
    SK: `SESSION`,
    Email: `EMAIL-${o.email}`,
    Content: o,
  });
