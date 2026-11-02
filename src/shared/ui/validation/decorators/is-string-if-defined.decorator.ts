import { IsString, ValidateIf, ValidationOptions } from 'class-validator';

interface IsStringIfDefinedOptions {
  allowNull?: boolean;
  validationOptions?: ValidationOptions;
}

export function IsStringIfDefined({
  allowNull = false,
  validationOptions,
}: IsStringIfDefinedOptions = {}): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    ValidateIf((_, value) => {
      if (value === undefined) {
        return false;
      }

      if (allowNull && value === null) {
        return false;
      }

      return true;
    })(target, propertyKey);

    IsString(validationOptions)(target, propertyKey);
  };
}
