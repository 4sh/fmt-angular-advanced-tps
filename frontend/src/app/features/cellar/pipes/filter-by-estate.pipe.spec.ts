import {FilterByEstatePipe} from './filter-by-estate.pipe';
import {CellarTestUtils} from '../test/cellar-test-utils';

describe('FilterByEstatePipe', () => {
    const pipe = new FilterByEstatePipe();
    const testBottles = CellarTestUtils.buildBottles();

    it('should properly filter by estate', () => {
        expect(pipe.transform(testBottles, 'Carbo'))
            .toHaveSize(1);
    });
});
