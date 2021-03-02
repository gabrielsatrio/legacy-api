import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Product } from '../../../entities/Product';

@InputType()
export class ProductInput implements Partial<Product> {
  @Field()
  @Length(1, 200)
  name!: string;

  @Field()
  @Length(1, 50)
  category!: string;

  @Field()
  price!: number;

  @Field()
  quantity!: number;

  @Field({ nullable: true })
  @Length(1, 100)
  image!: string;

  @Field()
  isActive!: boolean;
}
