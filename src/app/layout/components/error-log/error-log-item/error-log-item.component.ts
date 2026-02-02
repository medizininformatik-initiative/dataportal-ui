import { Component, Input, OnInit } from '@angular/core';
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue';

@Component({
  selector: 'num-error-log-item',
  templateUrl: './error-log-item.component.html',
  styleUrls: ['./error-log-item.component.scss'],
})
export class ErrorLogItemComponent implements OnInit {
  @Input() error!: ValidationIssue;

  code = '';

  ngOnInit(): void {
    const validationCode = this.error.getCode();
    this.code = validationCode.replace(/\D+/g, '');
  }
}
