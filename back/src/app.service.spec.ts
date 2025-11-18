// app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service'; // 👈 solo AppService

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('getHello debería retornar el mensaje esperado', () => {
    expect(service.getHello()).toBe('¡Bienvenid@ a Postres Saludables, Delicioso y Sano!');
  });
});
