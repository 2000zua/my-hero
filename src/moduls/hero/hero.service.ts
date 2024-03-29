import { PrismaService } from 'nestjs-prisma';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/shared/user.model';
import { CreateHeroInput } from './dto/create-hero.input';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { HeroIdArgs } from './dto/hero-id.args';
import { PublicErrors } from '../../shared/enums/public-errors.enum';
import { Hero } from './hero.models';


@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  async createHero(user: User, data: CreateHeroInput) {
    return this.prisma.hero.create({
      data: {
        realName: data.realName,
        alterEgo: data.alterEgo,
        public: false,
        image: '',
        userId: user.id,
      },
    });
  }

  async voteHero(user: User, heroIdArgs: HeroIdArgs) {
    const heroToVote = await this.getHero(heroIdArgs);
    if (!heroToVote || !heroToVote.public) {
      throw new NotFoundException({
        code: PublicErrors.HERO_NIT_FOUND,
        message: `Hero not found`,
      });
    }

    try {
      return await this.prisma.hero.update({
        where: { id: heroIdArgs.heroId },
        data: {
          userVoted: {
            create: [
              {
                assignedAt: new Date(),
                userId: user.id,
              },
            ],
          },
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException({
          code: PublicErrors.HERO_ALREADY_VOTED,
          message: `You already voted this hero. Just once please.`,
        });
      }
    }
  }

  async searchHeroes(query, { after, before, first, last }, orderBy) {
    return findManyCursorConnection(
      args =>
        this.prisma.hero.findMany({
          include: {
            user: false,
            userVoted: true,
            _count: {
              select: { userVoted: true },
            },
          },
          where: {
            alterEgo: { contains: query || '' },
            public: true,
          },
          orderBy:
            orderBy.field === 'usersVoted'
              ? {
                  userVoted: {
                    _count: orderBy.direction,
                  },
                }
              : orderBy
              ? { [orderBy.field]: orderBy.direction }
              : null,
          ...args,
        }),
      () =>
        this.prisma.hero.count({
          where: {
            alterEgo: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
  }

  getHero(heroIdArgs: HeroIdArgs) {
    return this.prisma.hero.findUnique({
      include: { userVoted: true },
      where: { id: heroIdArgs.heroId },
    });
  }

  async getHeroVotes(heroIdArgs: HeroIdArgs) {
    const heroVotes = await this.prisma.votesOnHeroes.findMany({
      where: {
        heroes: {
          id: heroIdArgs.heroId,
        },
      },
    });
    return { votes: heroVotes.length };
  }

  getUser(hero: Hero) {
    return this.prisma.hero.findUnique({ where: { id: hero.id } }).user();
  }
}