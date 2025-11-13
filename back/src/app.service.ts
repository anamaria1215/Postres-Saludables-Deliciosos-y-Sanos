import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Category } from './entities/category.entity';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from './enum/roles.enum';


@Injectable()
export class AppService {
  getHello(): string {
    console.log('Se envió la respuesta del getHello.');
    return '¡Bienvenid@ a Postres Saludables, Delicioso y Sano!';
  }
}

//Precarga de usuarios y categorias
//Se cargan automáticamente al levantar el back 

@Injectable()
export class InitialDataLoader implements OnModuleInit {
  constructor (
    @InjectRepository(Credential)
    private readonly credentialDBRepo: Repository<Credential>,

    @InjectRepository(User)
    private readonly userProfileDBRepo: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryDBRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    console.log('Iniciando la precarga de datos iniciales...');
    const count = await this.credentialDBRepo.count();
    if (count === 0) {
      await this.loaderData();
    } else {
      console.log('Ya existen datos iniciales precargados en la base de datos de Fur-ever.');
    }
  }

  private async loaderData() {
    
    //Rutas de los archivos JSON y lectura

    const credsUsersPath = path.resolve(__dirname, '..', 'utils', 'data.json');
    const catsPath = path.resolve(__dirname, '..', 'utils', 'categories.json');
   
    const credsUsersData = JSON.parse(fs.readFileSync(credsUsersPath, 'utf-8'));
    const catsData = JSON.parse(fs.readFileSync(catsPath,'utf-8'));
  
    //Conteo de datos leídos para console.logs

    const totalAdmins = credsUsersData.admins ? credsUsersData.admins.length : 0;
    const totalUsers = credsUsersData.users ? credsUsersData.users.length : 0;
    const totalFinalUsers = totalAdmins + totalUsers;
    const totalCategories = catsData.length;

    console.log('Datos leídos en los archivos JSON:');
    console.log(`Total admins: ${totalAdmins}`);
    console.log(`Total usuarios: ${totalUsers}`);
    console.log(`Total general de usuarios: ${totalFinalUsers}`);
    console.log(`Total categorías: ${totalCategories}`);

    //Precarga de usuarios y sus credenciales. 5 admin y 10 usuarios 
    const queryRunnerUsers = this.credentialDBRepo.manager.connection.createQueryRunner();
    await queryRunnerUsers.connect();
    await queryRunnerUsers.startTransaction();

    try {
      console.log('Precargando credenciales y usuarios...');
      const users = [...(credsUsersData.admins || []), ...(credsUsersData.users || [])];

      await Promise.all(
        users.map(async (user) => {
          const credential = user.credential?.[0];

          if (!credential) {
            console.warn(`El usuario \"${user.name} ${user.lastname}\" no tiene credencial asociada.`);
          }

          const userExists = await this.credentialDBRepo.findOne({ where: { username: credential.username } });
          if (!userExists) {
            const hashedPassword: string = await bcrypt.hash(credential.password, 10);

            const newCredential = this.credentialDBRepo.create({
              username: credential.username,
              password: hashedPassword,
              role: credential.role as RolesEnum,
            });
            await queryRunnerUsers.manager.save(newCredential);
            console.log(`Credencial creada para el usuario: ${credential.username}.`);

            const newUser = this.userProfileDBRepo.create({
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              address: user.address,
              birthDay: new Date(user.birthDay),
              credential: newCredential,
            });
            await queryRunnerUsers.manager.save(newUser);
            console.log(`Perfil de usuario creado: ${user.name} ${user.lastName} - ${credential.username}.`);
          
          } else {
            console.log(`Usuario \"${credential.username}\" ya existe en la base de datos.`);
          }
        })
      );

      await queryRunnerUsers.commitTransaction();
      console.log('Usuarios precargados correctamente. Total:', totalFinalUsers);
    } catch (error) {
      console.error('Error al precargar usuarios. Revirtiendo cambios...');
      await queryRunnerUsers.rollbackTransaction();
      console.error(error);
    } finally {
      await queryRunnerUsers.release();
    }
        
    //Precarga de categorias
    const queryRunnerCats = this.categoryDBRepo.manager.connection.createQueryRunner();
    await queryRunnerCats.connect();
    await queryRunnerCats.startTransaction();

    try {
      console.log('Precargando categorias...');
      await Promise.all(
        catsData.map(async (category) => {
          const categoryExists = await this.categoryDBRepo.findOne({ where: { name: category.name } });
          if (!categoryExists) {
            const newCategory = this.categoryDBRepo.create({
              name: category.name,
              description: category.description,
            });
            await queryRunnerCats.manager.save(newCategory);
            console.log(`Categoria creada: ${category.name}.`);
          } else {
            console.log(`La categoria ${category.name} ya existe en la base de datos.`);
          }
        })
      );

      await queryRunnerCats.commitTransaction();
      console.log('Categorías precargadas correctamente. Total:', totalCategories);
    } catch (error) {
      console.error('Error al precargar categorías. Revirtiendo cambios...');
      await queryRunnerCats.rollbackTransaction();
      console.error(error);
    } finally {
      await queryRunnerCats.release();
    }

    console.log('Precarga de datos completada exitosamente.');
  }
}