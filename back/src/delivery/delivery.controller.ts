import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { UpdateStatusDeliveryDto } from './DTOs/change-status-delivery.dto';
import { CreateDeliveryDto } from './DTOs/create-delivery.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Domicilios')
@ApiBearerAuth()
@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    //Rutas del admin

    //Obtener todos los domicilios
    @Get('all')
    @ApiOperation({ summary: 'Obtener todos los domicilios | ADMIN.', description: 'Retorna la lista de todos los domicilios registrados en el sistema.' })
    @ApiResponse({ status: 200, description: 'Listado de domicilios registrados obtenido correctamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    getAllDeliveries(){
        return this.deliveryService.getAllDeliveriesService();
    }    

    //Registar un domicilio
    @Post('create')
    @ApiOperation({ summary: 'Registrar el domicilio de una orden | ADMIN.', description: 'Crea un nuevo registro en el sistema del domicilio de una orden.' })
    @ApiBody({ description: 'Datos necesarios para registrar un domicilio.', type: CreateDeliveryDto })
    @ApiResponse({ status: 201, description: 'Domicilios registrado correctamente.' })
    @HttpCode(HttpStatus.CREATED)
    @Roles(RolesEnum.ADMIN)
    getRegisterDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
        return this.deliveryService.postRegisterDeliveryService(createDeliveryDto);
    }

    //Actualizar el estado de un domicilio
    @Put('update-status/:uuid')
    @ApiOperation({ summary: 'Actualizar el estado de un domicilio | ADMIN.', description: 'Permite actualizar el estado de un domicilio.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del domicilio a actualizar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiBody({ description: 'Datos necesarios para actualizar el estado de un domicilio.', type: UpdateStatusDeliveryDto })
    @ApiResponse({ status: 200, description: 'Estado del domicilio actualizado correctamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN)
    putUpdateDeliveryStatus(
        @Param('uuid') uuid: string, 
        @Body() updateStatusDeliveryDto: UpdateStatusDeliveryDto
    ){
        return this.deliveryService.putUpdateDeliveryStatusService(
            uuid, 
            updateStatusDeliveryDto
        );
    }

    //Rutas compartidas

    //Obtener un domicilio por Id
    @Get(':uuid')
    @ApiOperation({ summary: 'Obtener un domicilio por su UUID | ADMIN Y USER.', description: 'Permite obtener un domicilio consultando por su UUID.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del domicilio a consultar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Estado del domicilio actualizado correctamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    getDeliveryById(
        @Param('uuid') uuid: string,
        @Req() req
    
    ){
        return this.deliveryService.getDeliveryByIdService(uuid, req);
    }
}
