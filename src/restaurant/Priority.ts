import {Restaurant} from "./entities/restaurant.entity";
import {User} from "../user/entities/user.entity";
import {Menu} from "../menu/entities/menu.entity";

export class Priority {
    private _orderedRestaurants: Restaurant[];
    private _favorites: Menu[];

    constructor(
        private readonly _restaurantsWithMenus: Restaurant[],
        private readonly _userWithFavorites: User,
    ) {
        this._orderedRestaurants = [];
        this._favorites = this._userWithFavorites.favorites;
    }

    getScoresEachRestaurants = () => {
        const scores: number[] = this._restaurantsWithMenus.map(restaurant => {
            return this.calculateScores(restaurant)
        });
        const restaurants: Restaurant[] = Object.assign([], this._restaurantsWithMenus);
        scores.forEach(score => {
            console.log('score:::::::', score);
            const topScoreIndex: number = scores.indexOf(Math.max(...scores));
            this._orderedRestaurants.push(restaurants[topScoreIndex]);
            delete scores[topScoreIndex];
        });
    }

    calculateScores = ({menus}: Restaurant): number => {
        let score: number = 0;
        const favorites: Menu[] = Object.assign([], this._favorites);
        menus.forEach(({ foodTitle, menuCategoryCode }) => {
            favorites.forEach(favorite => {
                if (favorite.foodTitle === foodTitle) {
                    score += 10;
                } else if (favorite.menuCategoryCode === menuCategoryCode) {
                    score += 5;
                }
            });
        });
        return score;
    }

    get orderedRestaurants(): Restaurant[] {
        this.getScoresEachRestaurants();
        return this._orderedRestaurants;
    }
}