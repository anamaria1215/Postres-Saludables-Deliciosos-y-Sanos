import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';

@Injectable()
export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly repository: Repository<Credential>,
  ) {}

  async findAll(): Promise<Credential[]> {
    return this.repository.find({ relations: ['user'] });
  }

  async findById(id: string): Promise<Credential | null> {
    return this.repository.findOne({
      where: { uuid: id },
      relations: ['user'],
    });
  }

async findByUsername(username: string): Promise<Credential | null> {
  return this.repository.findOne({ where: { username } });
}


  async createCredential(data: Partial<Credential>): Promise<Credential> {
    const newCredential = this.repository.create(data);
    return this.repository.save(newCredential);
  }

  async findByEmail(username: string): Promise<Credential | null> {
  return this.repository.findOne({ where: { username } });
}


  async updateCredential(id: string, data: Partial<Credential>): Promise<Credential | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, data);
    return this.repository.save(existing);
  }

  async deleteCredential(id: string): Promise<boolean> {
    try {
      const entity = await this.repository.findOne({ where: { uuid: id } });
      if (!entity) return false;

      await this.repository.remove(entity);
      return true;
    } catch (error) {
      console.error('Error al eliminar credencial:', error);
      return false;
    }
  }
}
