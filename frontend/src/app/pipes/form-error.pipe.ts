import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formError',
})
export class FormErrorPipe implements PipeTransform {
  error_prefix = 'errors.form';

  transform(value: ValidationErrors | null): string {
    if (value) {
      const key = Object.keys(value)[0];
      return this.error_prefix + '.' + key;
    }

    return '';
  }
}
