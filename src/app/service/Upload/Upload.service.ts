import { CheckAndUpgradeCCDLService } from '../Upgrade/CheckAndUpgradeCCDL.service'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { CrtdlProcessingPipelineService } from '../CrtdlProcessingPipeline.service'
import { FileUploadService } from './FileUpload.service'
import { Injectable, inject } from '@angular/core'
import { SnackbarMessageService } from '../SnackbarMessage.service'
import { NavigationHelperService } from '../NavigationHelper.service'

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private fileUploadService = inject(FileUploadService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private checkAndUpgradeCCDLService = inject(CheckAndUpgradeCCDLService)
  private crtdlProcessingPipelineService = inject(CrtdlProcessingPipelineService)
  private navigationHelperService = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public uploadCRTDL(file: File): void {
    if (file) {
      this.fileUploadService.readFile(file, this.onReaderLoad.bind(this))
    }
  }

  private onReaderLoad(result: string | ArrayBuffer | null): void {
    const importedQuery = JSON.parse(result as string)
    this.uploadAndTranslate(importedQuery)
  }

  public uploadAndTranslate(crtdl: CRTDLData): void {
    const preUpgraded = this.checkAndUpgradeCCDLService.checkAndUpgradeCCDL(crtdl)
    this.crtdlProcessingPipelineService.process(preUpgraded).subscribe(() => {
      this.snackbarMessageService.dataDefinitionUploadSuccess()
      this.navigationHelperService.navigateToDataQueryCohortDefinition()
    })
  }
}
