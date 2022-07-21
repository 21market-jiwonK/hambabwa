import {PartialType, PickType} from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(PickType(CreateMenuDto, [
    'foodCode',
    'foodTitle',
    'calorie',
    'imageUrl',
    'isRepresentative',
] as const)) {}
