import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Shipping } from './entities/spt-shipping';

@ObjectType()
export class ShippingResponse extends DataResponse(Shipping) {}
