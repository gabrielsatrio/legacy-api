import DataResponse from '@/types/DataResponse';
import { ObjectType } from 'type-graphql';
import { User } from '../../../entities/User';

@ObjectType()
export class UserResponse extends DataResponse(User) {}
