import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'score',
})
export class ScorePipe implements PipeTransform {
    public transform(value?: number): string {
        if (value === undefined || isNaN(value)) {
            return '';
        } else {
            return `${value} / 20`;
        }
    }
}
