import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Observable, from, map, mergeMap } from 'rxjs';
import { CompressorService } from '../services/compressor.service';

@Directive({
  selector: '[inputFile]',
})
export class InputFileDirective {
  @Output() upload = new EventEmitter<string>();

  constructor(private compressor: CompressorService) {}

  @HostListener('change', ['$event']) handleInputChange(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = (evt.target as HTMLInputElement).files;
    if (!files || !files.length) return;

    if (this.allImages(files)) {
      this.onImage(files);
      console.log('image');
    } else {
      this.onPdf(files);
      console.log('pdf');
    }
  }

  allImages = (files: FileList) => {
    return Array.from(files).every((file) => file.type.startsWith('image'));
  };

  async onPdf(files: FileList) {
    const pdfs = from(files).pipe(mergeMap((file) => this.readPdf(file)));

    pdfs.subscribe((result: string) => {
      this.upload.emit(result);
    });
  }

  readPdf = (file: File) => {
    const reader = new FileReader();
    const observable = new Observable<string>((ob) => {
      reader.onload = () => {
        ob.next(reader.result as string);
        ob.complete();
      };
    });

    reader.readAsDataURL(file);

    return observable;
  };

  async onImage(files: FileList) {
    const compress = from(files).pipe(
      mergeMap((file, index) => this.recursiveCompress(file, index, files))
    );

    compress.subscribe((res) => {
      this.upload.emit(res.data);
    });
  }

  recursiveCompress = (image: File, index: number, array: FileList) => {
    return this.compressor.compress(image).pipe(
      map((response) => {
        return {
          data: response,
          index,
          array,
        };
      })
    );
  };
}
