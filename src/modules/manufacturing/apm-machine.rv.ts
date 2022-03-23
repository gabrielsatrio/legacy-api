import config from '@/config/main';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import fs from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../core/entities/file';
import { MachineInput } from './apm-machine.in';
import { Machine } from './entities/apm-machine';
import { MachineView } from './entities/apm-machine.vw';

@Resolver(Machine)
export class MachineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMachineExist(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<boolean> {
    return (await this.getMachine(machineId, contract)) ? true : false;
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMachineDescriptionExist(
    @Arg('contract') contract: string,
    @Arg('description') description: string
  ): Promise<boolean> {
    return (await MachineView.findOne({ contract, description }))
      ? true
      : false;
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: { contract: In(contract) },
      order: { machineId: 'ASC' }
    });
  }

  @Query(() => MachineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<MachineView | undefined> {
    return await MachineView.findOne({ machineId, contract });
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getNewMachineId(
    @Arg('contract') contract: string,
    @Arg('categoryId') categoryId: string
  ): Promise<string> {
    try {
      const sql = `SELECT ROB_APM_Machine_API.Get_New_ID(:contract, :categoryId) AS "newMachineId" FROM DUAL`;
      const result = await getConnection().query(sql, [contract, categoryId]);
      return result[0].newMachineId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getUtilityMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: { contract: In(contract), departmentId: 'MTC' },
      order: { machineId: 'ASC' }
    });
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getMachinesForServicePRMap(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: { contract: In(contract) },
      order: { machineId: 'ASC' }
    });
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async createMachine(
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<Machine | undefined> {
    try {
      const existingData = await Machine.findOne({
        machineId: input.machineId,
        contract: input.contract
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Machine.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const result = await Machine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('input') input: MachineInput
  ): Promise<Machine | undefined> {
    try {
      const data = await Machine.findOne({
        machineId: input.machineId,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      Machine.merge(data, input);
      const result = await Machine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async deleteMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<Machine> {
    try {
      const data = await Machine.findOne({ machineId, contract });
      if (!data) throw new Error('No data found.');
      await Machine.delete({ machineId, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => File)
  // @UseMiddleware(isAuth)
  async uploadPhoto(
    @Arg('file', () => GraphQLUpload) file: FileUpload
  ): Promise<any> {
    try {
      const isProd = config.env === 'production';
      const isTest = config.env === 'test';
      const { createReadStream, mimetype, encoding, filename } = file;
      const path = 'uploads/images/machines/' + uuidv4() + filename;
      const url = `http${isProd || isTest ? 's' : ''}://${config.api.hostname}${
        !isProd && !isTest ? `:${config.api.port}` : ''
      }/${path}`;
      const stream = createReadStream();
      // const result = await getConnection()
      //   .createQueryBuilder()
      //   .insert()
      //   .into('ROB_APM_Machine_Photo')
      //   .values({
      //     machineId: filename.split('.')[0],
      //     contract: filename.split('.')[1],
      //     photo: stream
      //   })
      //   .execute();
      return new Promise((resolve, reject) => {
        stream
          .pipe(fs.createWriteStream(path))
          .on('finish', () => {
            resolve({
              success: true,
              message: 'File uploaded successfully',
              mimetype,
              filename,
              encoding,
              url
            });
          })
          .on('error', (err: Record<string, unknown>) => {
            console.error('Error event emitted!', err);
            reject({
              success: false,
              message: 'Error uploading file'
            });
          });
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
