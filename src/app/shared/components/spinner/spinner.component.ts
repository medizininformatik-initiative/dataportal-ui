import { Component, OnInit, model } from '@angular/core'

@Component({
  selector: 'num-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnInit {
  public readonly countdown = model<number>()

  public ngOnInit(): void {
    this.startCountdown()
  }

  public startCountdown(): void {
    const interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update((v: number) => v - 1)
      } else {
        clearInterval(interval)
        this.countdown.set(0)
      }
    }, 1000)
  }
}
