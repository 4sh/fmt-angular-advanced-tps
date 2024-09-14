import {Bottle, Color} from '../models/bottle.model';

export class CellarTestUtils {
    public static buildBottles(): Bottle[] {
        return [
            {id: '1', estate: 'Chateau Petrus', vintage: 2012, quantity: 1, color: Color.RED},
            {id: '2', estate: 'Chateau Cheval Blanc', vintage: 2020, quantity: 3, color: Color.RED},
            {id: '3', estate: 'Chateau Carbonnieux', vintage: 2003, quantity: 2, color: Color.WHITE},
        ];
    }
}
