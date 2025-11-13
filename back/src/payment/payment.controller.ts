import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './DTOs/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdatePaymentDto } from './DTOs/update-payment.dto';
import { PaymentService } from './payment.service';
import { RolesEnum } from 'src/enum/roles.enum';

@ApiTags('Pagos')
@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    //Creación de rutas CRUD

    //Rutas de admin

    //Ruta para ver todos los pagos
    @ApiOperation({ summary: 'Obtener todos los pagos | ADMIN.', description: 'Retorna la lista completa de pagos registrados en el sistema. Solo accesible para administradores.' })
    @ApiResponse({ status: 200, description: 'Listado de pagos obtenido correctamente.' })
    @ApiResponse({ status: 401, description: 'Acceso no autorizado. El usuario debe estar autenticado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido. El usuario no tiene permisos para ejecutar esta acción.' })
    @Get('get-all-payments')
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    getAllPayments(){
        return this.paymentService.getAllPaymentsService();
    }

    //Ruta para registrar un pago
    @ApiOperation({
    summary: 'Registrar un pago | ADMIN.',
    description: 'Permite al administrador registrar un pago externo confirmado.'
    })
    @ApiBody({ description: 'Datos necesarios para registrar el pago.', type: CreatePaymentDto })
    @ApiResponse({ status: 201, description: 'Pago registrado correctamente.' })
    @ApiResponse({ status: 401, description: 'Acceso no autorizado. El usuario debe estar autenticado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido. El usuario no tiene permisos para ejecutar esta acción.' })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @Roles(RolesEnum.ADMIN)
    postRegisterPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.postRegisterPaymentService(createPaymentDto);
    }
    
    //Ruta para ver un pago en específico por Id
    @ApiOperation({ summary: 'Obtener un pago por su Id.', description: 'Retorna los datos de un pago específico. Solo los administradores.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago a consultar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Pago encontrado y retornado correctamente.' })
    @ApiResponse({ status: 401, description: 'Acceso no autorizado. El usuario debe estar autenticado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido. El usuario no tiene permisos para ejecutar esta acción.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese Id.' })
    @Get('get-payment/:uuid')
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    getPaymentById(@Param('uuid', ParseUUIDPipe) uuid: string){
        return this.paymentService.getPaymentByIdService(uuid);
    }

    //Ruta para actualizar un pago manualmente (si necesario)
    @ApiOperation({ summary: 'Actualizar un pago manualmente | ADMIN.', description: 'Permite modificar un pago manualmente. Solo administradores pueden ejecutar esta acción.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago que se desea actualizar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiBody({ description: 'Datos para actualizar el estado del pago.', type: UpdatePaymentDto })
    @ApiResponse({ status: 200, description: 'Pago actualizado correctamente.' })
    @ApiResponse({ status: 401, description: 'Acceso no autorizado. El usuario debe estar autenticado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido. El usuario no tiene permisos para ejecutar esta acción.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese Id.' })
    @Put('update-payment/:uuid')
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    putUpdatePayment(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePaymentDto: UpdatePaymentDto
    ){
        return this.paymentService.putUpdatePaymentService(uuid, updatePaymentDto);
    }

    //Ruta para cambiar el estado de un pago a Fallido (soft delete)
    //El registro de un pago no debería poder borrarse
    @ApiOperation({ summary: 'Marcar un pago como fallido | ADMIN.', description: 'Permite cambiar el estado del pago a "Fallido" si no se completó. Los pagos no se eliminan, solo cambian de estado.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago que será marcado como fallido.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Pago marcado como fallido correctamente.' })
    @ApiResponse({ status: 401, description: 'Acceso no autorizado. El usuario debe estar autenticado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido. El usuario no tiene permisos para ejecutar esta acción.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese Id.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    deletePayment(
        @Param('uuid', ParseUUIDPipe) uuid: string,
    ) {
        return this.paymentService.deletePaymentService(uuid);
    }
}