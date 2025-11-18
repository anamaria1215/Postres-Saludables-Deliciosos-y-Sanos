import { 
    BadRequestException,
    CanActivate, 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
} from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from 'express';
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(
        context: 
        ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('El token es requerido.');
        }
        // Esperar que venga en formato "Bearer <token>" 
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token inválido.');
        }
        //Verificar la existencia del secreto
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new BadRequestException('Configuración del servidor incorrecta.');
        }

        try {
            //Verificar el token
            const payload = this.jwtService.verify(token, { secret });
            console.log('Payload dentro de AuthGuard:', payload);
            payload.exp = new Date(payload.exp * 1000);
            payload.iat = new Date(payload.iat * 1000);
            if (!payload.role) {
                throw new UnauthorizedException('No tienes los permisos necesarios.');
            }

            (request as any).user = payload;
            return true;
        }  catch (error) {
            if (error instanceof TokenExpiredError)
                throw new UnauthorizedException('El token ha expirado.');
            if (error instanceof JsonWebTokenError)
                throw new UnauthorizedException('Token inválido.');
            throw new UnauthorizedException('Error de autenticación.');
        }
    }  
}