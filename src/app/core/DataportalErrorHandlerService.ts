import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarHelperService } from '../service/SnackbarHelper.service';
import { ErrorDisplayService } from '../shared/service/ErrorDisplay/error-display.service';
import { DataportalErrorPayloadType } from './model/DataportalErrorPayloadType';

@Injectable()
export class DataportalErrorHandlerService implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private snackBarService: SnackbarHelperService,
    private errorDisplayService: ErrorDisplayService
  ) {}

  public handleError(error: unknown): void {
    this.zone.run(() => {
      console.error('An error occurred:', error);

      // Check if error has the expected structure (type, payload, url)
      if (this.isDataportalError(error)) {
        const dataportalError = error as {
          type: string
          payload: DataportalErrorPayloadType
          url: string
        };
        this.errorDisplayService.showError(
          dataportalError.payload,
          dataportalError.type as any,
          dataportalError.url
        );
      } else {
        // For generic errors, show as a simple error array
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorPayload: DataportalErrorPayloadType = [
          {
            message: errorMessage,
            type: 'Error',
            code: 'UNKNOWN',
            severity: 'ERROR',
          },
        ];
        this.errorDisplayService.showError(errorPayload, 'GENERIC_ERROR' as any, '');
      }
    });
  }

  private isDataportalError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'payload' in error &&
      'url' in error
    );
  }
}
