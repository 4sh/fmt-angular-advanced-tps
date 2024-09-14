import {FilterByEstatePipe} from './filter-by-estate.pipe';
import {TestUtils} from '../services/test-utils';

describe('FilterByEstatePipe', () => {
    const pipe = new FilterByEstatePipe();
    const testBottles = TestUtils.buildBottles();

    it('should properly filter by estate', () => {
        expect(pipe.transform(testBottles, 'Carbo'))
            .toHaveSize(1);
    });
});
