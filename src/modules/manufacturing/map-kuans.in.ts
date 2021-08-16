import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MappingKuans } from './entities/map-kuans';

@InputType()
export class MappingKuansInput implements Partial<MappingKuans> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  @Length(1, 25)
  partNo!: string;

  @Field()
  @Length(1, 3)
  rackId!: string;

  @Field()
  @Length(1, 200)
  rackDescription!: string;

  @Field()
  @Length(1, 5)
  activeStatus!: string;

  @Field({ nullable: true })
  lampNo?: number;

  @Field({ nullable: true })
  @MaxLength(1)
  pwdType?: string;

  @Field({ nullable: true })
  @MaxLength(1)
  pwdKind?: string;

  @Field({ nullable: true })
  @MaxLength(1)
  pwdConc?: string;

  @Field({ nullable: true })
  @MaxLength(10)
  colorName?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  oldContract?: string;

  @Field({ nullable: true })
  @MaxLength(25)
  oldPartNo?: string;
}
