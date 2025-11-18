import {
Injectable,
CanActivate,
ExecutionContext,
ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private readonly reflector: Reflector) {}

canActivate(
  context: ExecutionContext,
): boolean | Promise<boolean> | Observable<boolean> {
  // Obtener los roles permitidos definidos con @Roles()
  const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
    'roles', 
    [context.getHandler(), context.getClass(),]
  );

  console.log('Roles requeridos para esta ruta:', requiredRoles);
  
  const request = context.switchToHttp().getRequest();
  
  const payload = request.user;
  console.log('Payload del usuario en el guard de roles:', payload);
  
  const userRole = () =>
    requiredRoles?.some(
      (role) => payload?.role?.toUpperCase() === role.toUpperCase(),
    );
    
    // Si no hay roles requeridos, se permite acceso automáticamente
    const validate =
    !requiredRoles || (payload && payload.role && userRole());
    
    if (!validate) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este contenido.',
      );
    }
    return validate;
  }
}