import { AbstractArrayEntityProvider } from '../../Provider/Abstract/AbstractArrayEntityProvider'
import { BehaviorSubject, Observable } from 'rxjs'
import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterProviderService extends AbstractArrayEntityProvider<CriteriaSearchFilterValue> {
  private readonly selectedModulesSubject = new BehaviorSubject<string[]>([])

  constructor() {
    super()
  }

  public selectId(entity: CriteriaSearchFilterValue): string {
    return entity.getLabel()
  }

  public setSelectedModules(modules: string[]): void {
    this.selectedModulesSubject.next(modules)
  }

  public getSelectedModules(): Observable<string[]> {
    return this.selectedModulesSubject.asObservable()
  }
}
