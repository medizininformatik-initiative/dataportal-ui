import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { forkJoin, map, Observable } from 'rxjs'
import { BackendService } from '../Backend.service'

@Injectable({
  providedIn: 'root',
})
export class ChunkedRequestService {
  private readonly backendService = inject(BackendService)
  private readonly http = inject(HttpClient)

  private readonly chunkSize = 1900

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getChunkedRequest(ids: string[], path: string): Observable<Array<any>> {
    const chunks = this.backendService.chunkArrayForStrings(ids, this.chunkSize)
    const observables = chunks.map((chunk: string[]) => {
      const commaSeparatedIds = chunk.join(',')
      return this.http.get<Array<any>>(this.backendService.createUrl(path + commaSeparatedIds))
    })
    return forkJoin(observables).pipe(map((results: any[][]) => [].concat(...results)))
  }
}
