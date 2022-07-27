import {PartialType} from "@nestjs/swagger";
import {Restaurant} from "../entities/restaurant.entity";

export class ResponseRestaurantDto extends PartialType(Restaurant) {
    constructor({ ...restaurant }: Restaurant) {
        super();
        const rest = Object.assign({}, restaurant);
        Object.keys(rest).map(key => this[key] = rest[key]);
    }
    hasCommented: boolean;
}