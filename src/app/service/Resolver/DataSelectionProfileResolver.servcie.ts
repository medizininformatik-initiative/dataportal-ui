import { DataSelectionProfileTree } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTree';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadDataSelectionProfileTreeService } from '../DataSelection/LoadDataSelectionProfileTree.service';

@Injectable({
  providedIn: 'root',
})
export class DataSelectionProfileResolverService {
  constructor(private loadDataSelectionProfileTreeService: LoadDataSelectionProfileTreeService) {}

  public resolve(): Observable<DataSelectionProfileTree> {
    return this.loadDataSelectionProfileTreeService.loadProfileTree();
  }
}
