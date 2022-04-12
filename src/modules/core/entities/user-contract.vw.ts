import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { User } from './user';

@Entity('ATJ_APP_USER_CONTRACT_MV')
@ObjectType()
export class UserContractView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'USERNAME' })
  username!: string;

  @Field()
  @PrimaryColumn({ name: 'USERNAME_DB' })
  usernameDb!: 'AT' | 'AG';

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'IS_DEFAULT' })
  isDefault!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.contracts, {
    nullable: true
  })
  @JoinColumn({ name: 'USERNAME', referencedColumnName: 'ifsUsername' })
  users?: User;
}
