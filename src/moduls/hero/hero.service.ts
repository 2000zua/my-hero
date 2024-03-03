import { Injectable } from '@nestjs/common';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';

@Injectable()
export class HeroService {
  create(createHeroInput: CreateHeroInput) {
    return 'This action adds a new hero';
  }

  findAll() {
    return `This action returns all hero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hero`;
  }

  update(id: number, updateHeroInput: UpdateHeroInput) {
    return `This action updates a #${id} hero`;
  }

  remove(id: number) {
    return `This action removes a #${id} hero`;
  }
}
