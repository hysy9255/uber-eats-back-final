import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrNullButDefined(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyName) => {
    registerDecorator({
      name: 'isStringOrNullButDefined',
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return value === null || typeof value === 'string';
        },

        defaultMessage() {
          return 'must be provided and must be a string or null';
        },
      },
    });
  };
}
