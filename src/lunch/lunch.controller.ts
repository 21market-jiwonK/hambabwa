import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LunchService } from './lunch.service';
import { CreateLunchDto } from './dto/create-lunch.dto';
import { UpdateLunchDto } from './dto/update-lunch.dto';

@Controller('lunch')
export class LunchController {
  constructor(private readonly lunchService: LunchService) {}

  @Post()
  create(@Body() createLunchDto: CreateLunchDto) {
    return this.lunchService.create(createLunchDto);
  }

  @Get()
  findAll() {
    return this.lunchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lunchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLunchDto: UpdateLunchDto) {
    return this.lunchService.update(+id, updateLunchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lunchService.remove(+id);
  }
}
