import { JsonPipe } from '@angular/common'
import { Component, input, Input, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue'

@Component({
  selector: 'num-error-log-item',
  templateUrl: './error-log-item.component.html',
  styleUrls: ['./error-log-item.component.scss'],
  standalone: true,
  imports: [JsonPipe, TranslateModule],
})
export class ErrorLogItemComponent implements OnInit {
  public error = input<ValidationIssue>()

  public profileUpgrade = input<ProfileUpgrade>()

  public code = ''

  public ngOnInit(): void {
    const validationCode = this.error()?.getCode()
    this.code = validationCode?.replace(/\D+/g, '') || ''
  }
}
