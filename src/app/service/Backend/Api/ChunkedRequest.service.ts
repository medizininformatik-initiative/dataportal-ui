import { BackendService } from '../Backend.service';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChunkedRequestService {
  private readonly chunkSize = 1900;

  constructor(private backendService: BackendService, private http: HttpClient) {}

  public getChunkedRequest<T>(
    ids: string[],
    path: string,
    context: HttpContext = new HttpContext()
  ): Observable<Array<any>> {
    const chunks = this.backendService.chunkArrayForStrings(ids, this.chunkSize);
    const observables = chunks.map((chunk) => {
      const commaSeparatedIds = chunk.join(',');
      return this.http.get<Array<any>>(this.backendService.createUrl(path + commaSeparatedIds), {
        context,
      });
    });
    return forkJoin(observables).pipe(map((results) => [].concat(...results)));
  }
}
