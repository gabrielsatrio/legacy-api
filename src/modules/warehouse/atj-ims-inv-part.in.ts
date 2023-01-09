import { IsDate, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImsInvPart } from './entities/atj-ims-inv-part';

@InputType()
export class ImsInvPartInput implements Partial<ImsInvPart> {
  @Field()
  @MaxLength(25)
  partNo!: string;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(200)
  description!: string;

  @Field()
  @MaxLength(50)
  color!: string;

  @Field()
  @MaxLength(1)
  partStatus!: string;

  @Field()
  @MaxLength(10)
  unitMeas!: string;

  @Field({ nullable: true })
  @MaxLength(30)
  catchUnitMeas?: string;

  @Field()
  @IsDate()
  createdDate!: Date;

  @Field()
  @MaxLength(5)
  createdBy!: string;

  @Field()
  @IsDate()
  modifiedDate!: Date;
  @Field()
  @MaxLength(5)
  modifiedBy!: string;
}
