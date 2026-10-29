import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'

@Component({
  selector: 'num-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
})
export class SearchbarComponent {
  private readonly activeSearchTermService = inject(ActiveSearchTermService)

  private readonly debounceTime = 300
  private readonly inputSubject = new Subject<string>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {
    this.inputSubject.pipe(debounceTime(this.debounceTime), takeUntilDestroyed()).subscribe((value) => {
      this.currentText.set(value)
      this.activeSearchTermService.setActiveSearchTerm(value)
      if (value.length >= this.minLength() || value.length === 0) {
        this.searchTextChange.emit(value)
      }
    })

    effect(() => {
      const value = this.searchText() ?? ''
      const minLength = this.minLength()
      const currentValue = untracked(() => this.currentText())
      if (value !== currentValue && value.length >= minLength) {
        this.patchInput(value)
      }
    })
  }

  public readonly label = input<string | undefined>('SHARED_COMPONENTS.SEARCH.DEFAULT_LABEL')
  public readonly minLength = input<number>(3)
  public readonly searchText = input<string>('')
  public readonly searchTextChange = output<string>()
  public readonly icon = input<string>('search')

  public readonly inputValue = signal(this.searchText() || '')
  public readonly currentText = signal('')
  public readonly showWarning = computed(() => {
    const value = this.currentText()
    return value.length > 0 && value.length < this.minLength()
  })

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.inputValue.set(value)
    this.inputSubject.next(value)
  }

  public patchInput(value: string): void {
    this.inputValue.set(value)
    this.inputSubject.next(value)
  }

  public clearInput(): void {
    this.patchInput('')
  }
}
