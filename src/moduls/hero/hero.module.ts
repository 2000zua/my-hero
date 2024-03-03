import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';

@Module({
  providers: [HeroResolver, HeroService],
})
export class HeroModule {}
