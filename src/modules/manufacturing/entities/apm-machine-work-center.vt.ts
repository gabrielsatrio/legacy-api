import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class MachineWorkCenter {
  @Field()
  workCenterNo!: string;

  @Field()
  contract!: string;

  @Field()
  description!: string;

  @Field()
  departmentNo!: string;

  @Field()
  machineId!: string;

  @Field()
  machineDescription!: string;

  @Field()
  objId!: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.workCenterNo})`;
  }

  @Field()
  altMachineDescription(): string {
    return `${this.machineDescription} (${this.machineId})`;
  }
}
