import { 
    Body, 
    Controller, 
    Delete, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseUUIDPipe, 
    Post, 
    Put, 
    Req, 
    UseGuards 
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { AddProductDto } from './DTOs/add-product.dto';
import { UpdateProductQuantityDto } from './DTOs/update-detail.dto';
import { CartDetailService } from './cartDetail.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Detalles del carrito') // Agrupa las rutas en Swagger
@ApiBearerAuth()
@Controller('cart-details')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartDetailController {
    constructor(private readonly cartDetailService: CartDetailService) {}

    //Rutas del user

    //Agregar un producto al carrito
    @Post('add-product')
    @ApiOperation({ summary: 'Agregar un producto al carrito activo | USER.', description: 'Permite agregar un nuevo producto al carrito activo del usuario.' })
    @ApiBody({ description: 'Datos necesarios para añadir producto al carrito.', type: AddProductDto })
    @ApiResponse({ status: 200, description: 'Producto añadido al carrito exitosamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.USER)
    postAddProduct(
        @Req() req,
        @Body() addProductDto: AddProductDto
    ){
        return this.cartDetailService.postAddProductService(req, addProductDto);
    } 

    //Actualizar cantidad de un producto en el carrito
    @Put('update-product-quantity/:uuid')
    @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito activo | USER.', description: 'Permite actualizar la cantidad de un producto que ya se encuentra en el carrito activo del usuario.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del detalle del carrito donde se encuentra el producto a actualizar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiBody({ description: 'Datos necesarios para actualizar la cantidad de producto al carrito.', type: UpdateProductQuantityDto })
    @ApiResponse({ status: 200, description: 'Cantidad del producto en el carrito actualizada exitosamente.' })
    @HttpCode(HttpStatus.OK)
    @Roles(RolesEnum.USER)
    putUpdateProductQuantity(
        @Req() req,
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updateProductQuantityDto: UpdateProductQuantityDto
    ){
        return this.cartDetailService.putUpdateProductQuantityService(
            req, 
            uuid,
            updateProductQuantityDto
        );
    } 

    //Eliminar un producto del carrito
    @Delete('delete-product/:uuid')
    @ApiOperation({ summary: 'Eliminar un producto del carrito activo | USER.', description: 'Permite eliminar completamente un producto que ya se encuentra en el carrito activo del usuario.' })
    @ApiParam({
        name: 'uuid',
        type: 'string',
        description: 'UUID del detalle del carrito donde se encuentra el producto a eliminar.',
        example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8'
    })
    @ApiResponse({ status: 200, description: 'Producto eliminado del carrito exitosamente.' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolesEnum.USER)
    deleteProductCart(
        @Req() req,
        @Param('uuid', ParseUUIDPipe) uuid: string
    ){
        return this.cartDetailService.deleteProductCartService(req, uuid);
    }     
}
