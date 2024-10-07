/**
 * Entity is a type of object that is not defined by its attributes, but rather by a thread of continuity and its identity.
 */

export type Entity<Content = unknown> = {
  PK: string;
  SK: string;
  Content: Content;
  Updated: string;
  Created: string;
  Status: 'Ativo' | 'Inativo'; //'Excluído';
};

export const entityFactory = <T extends Entity>({
  PK,
  SK,
  Content,
  ...extra
}: Replace<
  T,
  {
    Created?: string;
    Updated?: string;
    Status?: 'Ativo' | 'Inativo';
  }
>) =>
  ({
    PK,
    SK,
    Content,
    Created: extra.Created || new Date().toISOString(),
    Updated: extra.Updated || new Date().toISOString(),
    Status: 'Ativo',
    ...extra,
  }) as T;

/**
 * Optional is a type that represents an optional value.
 */
export type Optional<T> = T | null | undefined;
export type OptionalPromise<T> = Promise<Optional<T>>;

/**
 * Omit is a type that represents an object without a given set of properties.
 */
export type Replace<T, R> = Omit<T, keyof R> & R;

/**
 * Result Monad Implementation
 * A simple implementation of the Result Monad based on the Rust's Result type.
 */
export type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  kind: 'ok';
  isOk: true;
  value: T;
};

type Err<T> = {
  kind: 'err';
  isOk: false;
  error: T;
};

const Ok = <T>(value: Optional<T | void>): Ok<T> => ({
  kind: 'ok',
  isOk: true,
  value: value as T,
});

const Err = <T>(error: T): Err<T> => ({
  kind: 'err',
  isOk: false,
  error,
});

export const Result = {
  Ok,
  Err,
};

/**
 * Helper functions
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  if (!Array.isArray(array)) {
    throw new Error('O primeiro argumento deve ser um array.');
  }

  if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
    throw new Error('Chunk size deve ser um número inteiro maior que 0.');
  }

  const length = array.length;
  const chunks: T[][] = new Array(Math.ceil(length / chunkSize));

  for (let i = 0, j = 0; i < length; i += chunkSize, j++) {
    chunks[j] = array.slice(i, i + chunkSize);
  }

  return chunks;
};
