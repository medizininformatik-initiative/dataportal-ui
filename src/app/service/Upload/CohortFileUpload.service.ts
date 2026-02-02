import { Injectable } from '@angular/core';
import { ValidationService } from '../Validation.service';
import { Subscription } from 'rxjs';
import { StructuredQuery2FeasibilityQueryService } from '../Translator/StructureQuery/StructuredQuery2FeasibilityQuery.service';
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service';
import { FeasibilityQueryProviderService } from '../Provider/FeasibilityQueryProvider.service';
import { FileUploadService } from './FileUpload.service';

@Injectable({
  providedIn: 'root',
})
export class CohortFileUploadService {
  private validateSubscription: Subscription;

  constructor(
    private validationService: ValidationService,
    private structuredQuery2FeasibilityQueryService: StructuredQuery2FeasibilityQueryService,
    private feasibilityQueryService: FeasibilityQueryProviderService,
    private fileUploadService: FileUploadService,
    private snackbarService: SnackbarService
  ) {}

  public uploadCohort(file: File): void {
    if (file) {
      //this.fileUploadService.readFile(file, this.onReaderLoad.bind(this));
    }
  }

  public onReaderLoad(result: string | ArrayBuffer | null): void {
    try {
      const importedQuery = JSON.parse(result as string);
      if (importedQuery.inclusionCriteria?.length > 0) {
        this.doValidate(importedQuery);
      } else {
        this.snackbarService.displayErrorMessageWithNoCode('DATAQUERY.COHORT.ERROR.UPLOAD');
      }
    } catch (error) {
      console.error('Error parsing the file:', error);
      this.snackbarService.displayErrorMessageWithNoCode('DATAQUERY.COHORT.ERROR.UPLOAD');
    }
  }

  public doValidate(importedQuery): void {
    this.validateSubscription = this.validationService
      .validateStructuredQuery(importedQuery)
      .subscribe(
        (validatedStructuredQuery) => {
          this.structuredQuery2FeasibilityQueryService
            .translate(validatedStructuredQuery)
            .subscribe((feasibilityQuery) => {
              this.feasibilityQueryService.setFeasibilityQueryByID(
                feasibilityQuery,
                feasibilityQuery.getId(),
                true
              );
            });
        },
        (error) => {
          console.error('Validation error:', error);
        },
        () => {
          this.validateSubscription.unsubscribe();
        }
      );
  }
}
