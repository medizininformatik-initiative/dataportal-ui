import { NgClass } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { SnackbarService } from '../../service/Snackbar/Snackbar.service'

@Component({
  selector: 'num-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe],
})
export class SnackbarComponent implements OnInit {
  public snackbarService = inject(SnackbarService)

  public isVisible = false
  public message = ''
  public color = 'red'

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public ngOnInit() {
    this.snackbarService.visibility$.subscribe((isVisible) => {
      this.isVisible = isVisible
    })

    this.snackbarService.message$.subscribe((message) => {
      this.message = message
    })

    this.snackbarService.color$.subscribe((color) => {
      this.color = color
    })
  }

  public closeSnackbar() {
    this.snackbarService.deactivateSnackbar()
  }
}
