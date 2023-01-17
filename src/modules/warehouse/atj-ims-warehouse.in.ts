import { IsDate, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImsWarehouseBayBin } from './entities/atj-ims-warehouse';

@InputType()
export class ImsWarehouseBayBinInput implements Partial<ImsWarehouseBayBin> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(15)
  warehouseId!: string;

  @Field()
  @MaxLength(5)
  bayId!: string;

  @Field()
  @MaxLength(5)
  rowId!: string;

  @Field()
  @MaxLength(5)
  tierId!: string;

  @Field()
  @MaxLength(5)
  binId!: string;

  @Field()
  @MaxLength(35)
  locationNo!: string;

  @Field({ nullable: true })
  @MaxLength(200)
  description?: string;

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
