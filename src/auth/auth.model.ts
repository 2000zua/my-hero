import { ObjectType } from "@nestjs/graphql";
import { Token } from "./token.model";
import { User } from "src/moduls/user/shared/user.model";


@ObjectType()
export class Auth extends Token {
    user: User;
}