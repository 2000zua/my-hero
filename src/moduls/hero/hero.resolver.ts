import { PaginationArgs } from '../../shared/args/pagination.args';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions/';
import { UseGuards } from '@nestjs/common';
import { CreateHeroInput } from './dto/create-hero.input';
import { HeroConnection } from './hero-connection.model';
import { HeroOrder } from './dto/hero-order.input';
import { HeroIdArgs } from './dto/hero-id.args';
import { HeroService } from './hero.service';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { User } from '../user/shared/user.model';
import { Hero } from './hero.models';
import { UserEntity } from '../user/user.decorator';

const pubSub = new PubSub();

@Resolver(() => Hero)
export class HeroResolver {
  constructor(private heroService: HeroService) {}

  @Subscription(() => Hero)
  heroCreated() {
    return pubSub.asyncIterator('heroCreated');
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Hero)
  async createHero(@UserEntity() user: User, @Args('data') data: CreateHeroInput) {
    const newHero = this.heroService.createHero(user, data);
    await pubSub.publish('heroCreated', { heroCreated: newHero });
    return newHero;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Hero)
  async voteHero(@UserEntity() user: User, @Args() heroIdArgs: HeroIdArgs) {
    return this.heroService.voteHero(user, heroIdArgs);
  }

  @Query(() => HeroConnection)
  async searchHeroes(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => HeroOrder,
      nullable: true,
    })
    orderBy: HeroOrder
  ) {
    return await this.heroService.searchHeroes(query, { after, before, first, last }, orderBy);
  }

  @Query(() => Hero)
  async hero(@Args() heroIdArgs: HeroIdArgs) {
    return this.heroService.getHero(heroIdArgs);
  }

  @Query(() => Hero)
  async heroVotes(@Args() heroIdArgs: HeroIdArgs) {
    return this.heroService.getHeroVotes(heroIdArgs);
  }

  @ResolveField('user')
  async user(@Parent() hero: Hero) {
    return this.heroService.getUser(hero);
  }
}