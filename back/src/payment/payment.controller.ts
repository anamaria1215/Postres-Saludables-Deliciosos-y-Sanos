import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './DTOs/create-payment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdatePaymentDto } from './DTOs/update-payment.dto';
import { PaymentService } from './payment.service';
import { RolesEnum } from 'src/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Pagos')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    //Rutas de admin

    //Ver todos los pagos
    @Get('all')
    @ApiOperation({ summary: 'Obtener todos los pagos | ADMIN.', description: 'Retorna la lista completa de pagos registrados en el sistema. Solo accesible para administradores.' })
    @ApiResponse({ status: 200, description: 'Listado de pagos obtenido correctamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    getAllPayments(){
        return this.paymentService.getAllPaymentsService();
    }

    //Confirmar un pago
    @ApiOperation({ summary: 'Confirmar un pago | ADMIN.', description: 'Actualiza el estado de un pago a confirmado. Solo puede ser ejecutado por administradores o el sistema.' })  
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago que se desea confirmar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Pago confirmado correctamente.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese ID.' })
    @Put('confirm/:uuid')
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    putConfirmRPayment(@Param('uuid', ParseUUIDPipe) uuid: string,) {
        return this.paymentService.putConfirmPaymentService(uuid);
    }
    
    //Actualizar estado de un pago manualmente (si necesario)
    @Put('update-status/:uuid')
    @ApiOperation({ summary: 'Actualizar el estado de un pago | ADMIN.', description: 'Permite modificar el estado del pago manualmente. Solo administradores pueden ejecutar esta acción.'})
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago que se desea actualizar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiBody({ description: 'Datos para actualizar el estado del pago.', type: UpdatePaymentDto })
    @ApiResponse({ status: 200, description: 'Pago actualizado correctamente.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese ID.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    putUpdateStatusPayment(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePaymentDto: UpdatePaymentDto
    ){
        return this.paymentService.putUpdatePaymentStatusService(uuid, updatePaymentDto);
    }

    //Ruta para cambiar el estado de un pago a Fallido (soft delete)
    //El registro de un pago no debería poder borrarse
    @Delete('delete/:uuid')
    @ApiOperation({ summary: 'Marcar un pago como fallido | ADMIN.', description: 'Permite cambiar el estado del pago a "Fallido" si no se completó. Los pagos no se eliminan, solo cambian de estado.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago que será marcado como FALLIDO.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Pago marcado como fallido correctamente.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese Id.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    deletePayment(
        @Param('uuid', ParseUUIDPipe) uuid: string,
    ) {
        return this.paymentService.deletePaymentService(uuid);
    }

    //Rutas del user

    //Ruta para crear o registrar un pago (inicialmente con estado pediente mientras se confirma)
    @Post('checkout')
    @ApiOperation({ summary: 'Registrar un pago | USER.', description: 'Crea un registro del pago con estado pendiente mientras se confirma el pago real.' })
    @ApiBody({ description: 'Datos necesarios para registrar el pago.', type: CreatePaymentDto })
    @ApiResponse({ status: 201, description: 'Pago registrado correctamente.' })
    @HttpCode(HttpStatus.CREATED)
    @Roles(RolesEnum.USER) //Solo pagar ordene de pago propias
    postRegisterPayment(
        @Req() req,
        @Body() createPaymentDto: CreatePaymentDto
    ){
        return this.paymentService.postRegisterPaymentService(req, createPaymentDto);
    }

    //Rutas compartidas

    //Ver un pago en específico por Id
    @Get(':uuid')
    @ApiOperation({ summary: 'Obtener un pago por su Id | ADMIN Y USER.', description: 'Retorna los datos de un pago específico. El User solo puede ver pagos propios. El Admin puede ver cualquier pago.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del pago a consultar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Pago encontrado y retornado correctamente.' })
    @ApiResponse({ status: 404, description: 'No existe un pago con ese Id.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    getPaymentById(@Param('uuid', ParseUUIDPipe) uuid: string){
        return this.paymentService.getPaymentByIdService(uuid);
    }
}