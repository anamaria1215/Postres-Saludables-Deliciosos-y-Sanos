import { 
    registerDecorator, 
    ValidationArguments, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from "class-validator";

//Clase que implementa la lógica de validación
@ValidatorConstraint({ 
    name: 'MatchPassword', 
    async: false 
})
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(
        confirmPassword: any,
        args: ValidationArguments,
    ): boolean {
        const [propertyToCompare] = args.constraints; //Nombre del campo a comparar (en este caso el "password")
        const password = (args.object as any)[propertyToCompare]; //Valor del campo password
        return confirmPassword === password;
    }

    defaultMessage(args: ValidationArguments) {
        return 'La contraseña y la confirmación de la contraseña no coinciden.';
    }
}
//Decorador personalizado
export function MatchPassword(
    propertyToCompare: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [propertyToCompare],
            validator: MatchPasswordConstraint,
        });
    };
}