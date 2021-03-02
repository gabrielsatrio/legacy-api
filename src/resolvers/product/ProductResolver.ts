import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Product } from '../../entities/Product';
import { isAuth } from '../../middleware/isAuth';
import { Context } from '../../types/Context';
import { ProductInput } from './types/ProductInput';

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  @UseMiddleware(isAuth)
  async getProducts(): Promise<Product[] | undefined> {
    return await Product.find();
  }

  @Query(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  async getProduct(
    @Arg('id', () => Int) id: number
  ): Promise<Product | undefined> {
    return await Product.findOne(id);
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async createProduct(
    @Arg('input') input: ProductInput,
    @Ctx() { req }: Context
  ): Promise<Product> {
    return await Product.create({
      ...input,
      createdBy: req.session.userId
    }).save();
  }

  @Mutation(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductInput,
    @Ctx() { req }: Context
  ): Promise<Product | undefined> {
    const product = await Product.findOne({
      id,
      createdBy: req.session.userId
    });

    if (!product) {
      return undefined;
    }

    const updatedProduct = { ...product, ...input } as Product;
    await Product.save(updatedProduct);

    return updatedProduct;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProduct(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      await Product.delete(id);
      return true;
    } catch (err) {
      return false;
    }
  }
}
