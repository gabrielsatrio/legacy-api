import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

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
}
