import { Document } from '@/domain/customer';

import {
  ValidationOptions,
  buildMessage,
  registerDecorator,
} from 'class-validator';

export function IsDocumentType(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isDocumentType',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return Document.safeParse(value).success;
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property must be a valid document type (CPF or CNPJ)`,
          validationOptions,
        ),
      },
    });
  };
}
