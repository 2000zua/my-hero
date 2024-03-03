import { Resolver, Query, Mutation, Args,  ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Logger, UseGuards } from '@nestjs/common';
import { UserEntity } from './user.decorator';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { ChangePasswordInput } from './dto/change-password.input';
import { HeroIdArgs } from '../hero/dto/hero-id.args';
import { User } from './shared/user.model';
import { Hero } from '../hero/hero.models';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  private logger = new Logger('UserResolver');

  
  @Query(() => User) // operacao de consulta
  async me(@UserEntity() user: User): Promise<User>{
    this.logger.verbose(`User ${user.email} retrieving himself.`);
    return user;  
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@UserEntity() user: User, @Args('data') newUserData: UpdateUserInput) {
    return this.userService.updateUser(user.id, newUserData);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Hero)
  async removeHero(@UserEntity() user: User, @Args() heroIdArgs: HeroIdArgs) {
    return this.userService.removeHero(user, heroIdArgs);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(user.id, user.password, changePassword);
  }

  @ResolveField('heroes')
  heroes(@Parent() author: User) {
    return this.userService.getHeroes(author);
  }

}
