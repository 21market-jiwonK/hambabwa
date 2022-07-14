import { Injectable } from '@nestjs/common';
import { CreateLunchDto } from './dto/create-lunch.dto';
import { UpdateLunchDto } from './dto/update-lunch.dto';

@Injectable()
export class LunchService {
  create(createLunchDto: CreateLunchDto) {
    return 'This action adds a new lunch';
  }

  findAll() {
    return `This action returns all lunch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lunch`;
  }

  update(id: number, updateLunchDto: UpdateLunchDto) {
    return `This action updates a #${id} lunch`;
  }

  remove(id: number) {
    return `This action removes a #${id} lunch`;
  }
}
