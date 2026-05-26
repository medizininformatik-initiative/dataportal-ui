import { DataSelectionProfileTree } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTree'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { LoadDataSelectionProfileTreeService } from '../DataSelection/LoadDataSelectionProfileTree.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionProfileResolverService {
  private loadDataSelectionProfileTreeService = inject(LoadDataSelectionProfileTreeService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Resolves the data selection profile tree by fetching it from the backend.
   * @returns An observable containing the data selection profile tree.
   */
  public resolve(): Observable<DataSelectionProfileTree> {
    return this.loadDataSelectionProfileTreeService.loadProfileTree()
  }
}
