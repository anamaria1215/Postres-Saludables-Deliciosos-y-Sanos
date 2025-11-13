import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Entrada principal.',
    description: 'Devuelve un mensaje de bienvenida.'
  })
  @ApiOkResponse({
    description: 'Mensaje de bienvenida devuelto correctamente.',
    schema: {
      type: 'string',
      example: 'Bienvenido al sistema.'
    }
  })
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
