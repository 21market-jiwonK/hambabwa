import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity('v_menu_with_categories', {
    expression: `
        SELECT M.id AS menuId
            , M.foodTitle AS title
            , C2.title AS subTitle
            , M.calorie AS calorie
            , C3.title AS categoryDepth1
            , C1.title AS categoryDepth2
            , C.title AS categoryDepth3
        FROM menu M
            LEFT JOIN category C ON C.code = M.categoryCode
            LEFT JOIN category C1 ON C1.code = C.parentCode
            LEFT JOIN category C2 ON C2.code = C1.parentCode
            LEFT JOIN category C3 ON C3.code = C2.parentCode
            INNER JOIN restaurants_menus RM ON RM.menuId = M.id
    `
})
export class ViewMenuWithCategories {
    @ViewColumn()
    menuId: number;

    @ViewColumn()
    title: number;

    @ViewColumn()
    subTitle: number;

    @ViewColumn()
    calorie: number;

    @ViewColumn()
    categoryDepth1: number;

    @ViewColumn()
    categoryDepth2: number;

    @ViewColumn()
    categoryDepth3: number;
}