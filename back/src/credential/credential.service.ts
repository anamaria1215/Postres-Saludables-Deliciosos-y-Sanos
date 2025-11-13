import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CredentialRepository } from './credential.repository';
import { Credential } from '../entities/credential.entity';

@Injectable()
export class CredentialService {
  constructor(private readonly repository: CredentialRepository) {}

  async getAll(): Promise<Credential[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las credenciales');
    }
  }

  async getById(id: string): Promise<Credential> {
    try {
      const found = await this.repository.findById(id);
      if (!found) throw new NotFoundException(`Credencial con id ${id} no encontrada`);
      return found;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la credencial');
    }
  }

async create(data: Partial<Credential>): Promise<Credential> {
  try {
    if (!data.username || !data.password) {
      throw new ConflictException('Faltan campos obligatorios: username o password');
    }

    const existing = await this.repository.findByUsername(data.username);
    if (existing) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    const newCredential = await this.repository.createCredential(data);
    return newCredential;
  } catch (error) {
    throw new InternalServerErrorException('Error al crear la credencial');
  }
}

  async getByEmail(email: string): Promise<Credential> {
  try {
    const found = await this.repository.findByEmail(email);
    if (!found) throw new NotFoundException(`Credencial con email ${email} no encontrada`);
    return found;
  } catch (error) {
    throw new InternalServerErrorException('Error al buscar la credencial por email');
  }
}

  async update(id: string, data: Partial<Credential>): Promise<Credential> {
    try {
      const updated = await this.repository.updateCredential(id, data);
      if (!updated) throw new NotFoundException(`Credencial con id ${id} no encontrada`);
      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la credencial');
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const deleted = await this.repository.deleteCredential(id);
      if (!deleted) throw new NotFoundException(`Credencial con id ${id} no encontrada`);
      return `Credencial con id ${id} eliminada correctamente`;
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la credencial');
    }
  }
}


