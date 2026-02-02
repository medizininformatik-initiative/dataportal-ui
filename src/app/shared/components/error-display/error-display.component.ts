import { Component, OnInit } from '@angular/core';
import { ErrorDisplayService } from '../../service/ErrorDisplay/error-display.service';
import { DataportalErrorPayloadType } from 'src/app/core/model/DataportalErrorPayloadType';

@Component({
  selector: 'num-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
})
export class ErrorDisplayComponent implements OnInit {
  isVisible = false;
  errorData: DataportalErrorPayloadType | null = null;
  errorUrl = '';
  errorType = '';

  constructor(public errorDisplayService: ErrorDisplayService) {}

  ngOnInit() {
    this.errorDisplayService.visibility$.subscribe((isVisible) => {
      this.isVisible = isVisible;
    });

    this.errorDisplayService.errorData$.subscribe((errorData) => {
      this.errorData = errorData;
    });

    this.errorDisplayService.errorUrl$.subscribe((url) => {
      this.errorUrl = url;
    });

    this.errorDisplayService.errorType$.subscribe((type) => {
      this.errorType = type;
    });
  }

  public closeError() {
    this.errorDisplayService.hideError();
  }

  public downloadError() {
    if (!this.errorData) {return;}

    const errorContent = {
      type: this.errorType,
      url: this.errorUrl,
      timestamp: new Date().toISOString(),
      errors: this.errorData,
    };

    const blob = new Blob([JSON.stringify(errorContent, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-${new Date().getTime()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public saveError() {
    if (!this.errorData) {return;}

    const errorContent = {
      type: this.errorType,
      url: this.errorUrl,
      timestamp: new Date().toISOString(),
      errors: this.errorData,
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorContent, null, 2)).then(
      () => {
        console.log('Error copied to clipboard');
      },
      (err) => {
        console.error('Could not copy error: ', err);
      }
    );
  }

  public getErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }
    return JSON.stringify(error);
  }

  public getErrorDetails(error: any): string {
    const details: string[] = [];
    if (error.type) {details.push(`Type: ${error.type}`);}
    if (error.code) {details.push(`Code: ${error.code}`);}
    if (error.severity) {details.push(`Severity: ${error.severity}`);}
    return details.join(' | ');
  }
}
