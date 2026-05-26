import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { debounceTime } from 'rxjs/operators'
import { Subject, Subscription } from 'rxjs'
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
})
export class SearchbarComponent implements OnInit, OnChanges, OnDestroy {
  private activeSearchTermService = inject(ActiveSearchTermService)

  private readonly debounceTime = 300
  private inputSubject = new Subject<string>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  private subscriptions = new Subscription()

  @Input() label: string
  @Input() minLength = 3
  @Input() searchText = ''
  @Output() searchTextChange = new EventEmitter()
  @Input() icon: string

  showWarning = false
  inputValue = ''
  currentText = ''

  ngOnInit(): void {
    this.inputValue = this.searchText || ''

    this.subscriptions.add(
      this.inputSubject.pipe(debounceTime(this.debounceTime)).subscribe((value) => {
        this.currentText = value
        this.activeSearchTermService.setActiveSearchTerm(value)
        this.showWarning = value.length > 0 && value.length < this.minLength
        if (value.length >= this.minLength || value.length === 0) {
          this.searchTextChange.emit(value)
        }
      })
    )
  }

  onInput(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value
    this.inputSubject.next(this.inputValue)
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, propName)) {
        const change = changes[propName]
        switch (propName) {
          case 'searchText': {
            if (
              !change.isFirstChange() &&
              this.currentText !== change.currentValue &&
              change.currentValue.length >= this.minLength
            ) {
              this.patchInput(change.currentValue)
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  patchInput(value: string): void {
    this.inputValue = value
    this.inputSubject.next(value)
  }

  clearInput(): void {
    this.patchInput('')
  }
}
