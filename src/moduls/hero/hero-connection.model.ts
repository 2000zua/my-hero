import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../shared/functions/pagination';
import { Hero } from './hero.models';

@ObjectType()
export class HeroConnection extends PaginatedResponse(Hero) {}