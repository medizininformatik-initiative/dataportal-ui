import { Component, OnInit, model } from '@angular/core'

@Component({
  selector: 'num-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnInit {
  readonly countdown = model<number>()

  ngOnInit(): void {
    this.startCountdown()
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update((v) => v - 1)
      } else {
        clearInterval(interval)
        this.countdown.set(0)
      }
    }, 1000)
  }
}
