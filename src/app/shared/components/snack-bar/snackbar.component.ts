import { Component, OnInit } from '@angular/core'
import { SnackbarService } from '../../service/Snackbar/Snackbar.service'
import { NgClass } from '@angular/common'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe],
})
export class SnackbarComponent implements OnInit {
  isVisible = false
  message = ''
  color = 'red'
  constructor(public snackbarService: SnackbarService) {}

  ngOnInit() {
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
