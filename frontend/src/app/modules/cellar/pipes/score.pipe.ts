import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'score',
})
export class ScorePipe implements PipeTransform {
    public transform(value?: number): string {
        if (value) {
            return `${value} / 20`;
        } else {
            return '';
        }
    }
}
