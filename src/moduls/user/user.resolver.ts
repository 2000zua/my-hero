import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Logger } from '@nestjs/common';
import { UserEntity } from './user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  private logger = new Logger('UserResolver');

  
  @Query(() => User) // operacao de consulta
  async me(@UserEntity() user: User): Promise<User>{
    this.logger.verbose(`User ${user.email} retrieving himself.`);
    return user;  
  }


}
