import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserContractView } from './user-contract.vw';

@Entity('ATJ_APP_USER')
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'USERNAME', unique: true })
  username!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Column({ name: 'PASSWORD' })
  password!: string;

  @Field()
  @Column({ name: 'EMAIL', unique: true })
  email!: string;

  @Field()
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId!: string;

  @Field()
  @Column({ name: 'USERNAME_DB', default: 'AT' })
  usernameDb!: 'AT' | 'AG';

  @Field()
  @Column({ name: 'IFS_USERNAME' })
  ifsUsername!: string;

  @Field()
  @Index()
  @Column({ name: 'STATUS', default: 'Active' })
  status!: 'Active' | 'Inactive';

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field(() => [UserContractView], { nullable: true })
  @OneToMany(
    () => UserContractView,
    (userContractView) => userContractView.user,
    {
      nullable: true
    }
  )
  contracts?: UserContractView[];
}
