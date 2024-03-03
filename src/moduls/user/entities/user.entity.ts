import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Hero } from 'src/moduls/hero/entities/hero.entity';
import { BaseModel } from 'src/shared/models/base.model';

@ObjectType()
export class User extends BaseModel{
  
  @Field()
  firstname?: string;
  
  @Field()
  email: string;
  
  @Field()
  language: string;
  
  @Field()
  votedHeroes: Hero[];
  
  @HideField()
  password: string; 
}
