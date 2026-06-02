import { BuildProfileTreeService } from './Tree/BuildProfileTree.service'
import { DataSelectionApiService } from '../Backend/Api/DataSelectionApi.service'
import { DataSelectionProfileTree } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTree'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoadDataSelectionProfileTreeService {
  private dataSelectionApiService = inject(DataSelectionApiService)
  private buildProfileTreeService = inject(BuildProfileTreeService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public loadProfileTree(): Observable<DataSelectionProfileTree> {
    return this.dataSelectionApiService
      .getDataSelectionProfileTree()
      .pipe(map((response) => this.buildProfileTreeService.buildProfileTree(response)))
  }
}
