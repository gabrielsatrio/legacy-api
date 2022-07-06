import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SpareParts {
  @Field()
  partNo!: string;

  @Field()
  contract!: string;

  @Field()
  description!: string;

  @Field()
  qtyAvailable!: number;

  @Field()
  unitMeas!: string;

  @Field()
  partStatus!: string;

  @Field()
  objId!: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.partNo})`;
  }
}
