import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'num-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnInit {
  @Input()
  countdown: number

  ngOnInit(): void {
    this.startCountdown()
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--
      } else {
        clearInterval(interval)
        this.countdown = 0
      }
    }, 1000)
  }
}
