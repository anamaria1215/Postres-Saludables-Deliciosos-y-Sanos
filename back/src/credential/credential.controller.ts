import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { Credential } from '../entities/credential.entity';

@Controller('credential')
export class CredentialController {
  constructor(private readonly service: CredentialService) {}

  @Get()
  async getAll(): Promise<Credential[]> {
    return await this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Credential> {
    return await this.service.getById(id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string): Promise<Credential> {
    return await this.service.getByEmail(email);
  }

  @Post()
  async create(@Body() data: Partial<Credential>): Promise<Credential> {
    return await this.service.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Credential>): Promise<Credential> {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.service.delete(id);
  }
}
