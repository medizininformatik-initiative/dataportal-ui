import { Component, Input, OnInit } from '@angular/core'
import { ProfileUpgrade } from 'src/app/model/Upgrade/ProfileUpgrade'
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue'
import { JsonPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-error-log-item',
  templateUrl: './error-log-item.component.html',
  styleUrls: ['./error-log-item.component.scss'],
  standalone: true,
  imports: [JsonPipe, TranslateModule],
})
export class ErrorLogItemComponent implements OnInit {
  @Input()
  error: ValidationIssue

  @Input()
  profileUpgrade: ProfileUpgrade

  code = ''

  ngOnInit(): void {
    const validationCode = this.error?.getCode()
    this.code = validationCode?.replace(/\D+/g, '') || ''
  }
}
