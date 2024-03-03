import { HideField, ObjectType } from "@nestjs/graphql";
import { Hero } from "src/moduls/hero/entities/hero.entity";
import { BaseModel } from "src/shared/models/base.model";


@ObjectType()
export class User extends BaseModel {
  email: string;
  firstname?: string;
  heroes: Hero[];
  language: string;
  votedHeroes: Hero[];
  @HideField()
  password: string;
}