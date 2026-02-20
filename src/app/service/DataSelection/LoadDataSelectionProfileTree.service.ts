import { BuildProfileTreeService } from './Tree/BuildProfileTree.service';
import { DataSelectionApiService } from '../Backend/Api/DataSelectionApi.service';
import { DataSelectionProfileTree } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTree';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadDataSelectionProfileTreeService {
  constructor(
    private dataSelectionApiService: DataSelectionApiService,
    private buildProfileTreeService: BuildProfileTreeService
  ) {}

  public loadProfileTree(): Observable<DataSelectionProfileTree> {
    return this.dataSelectionApiService
      .getDataSelectionProfileTree()
      .pipe(map((response) => this.buildProfileTreeService.buildProfileTree(response)));
  }
}
