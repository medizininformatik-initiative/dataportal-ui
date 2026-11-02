import { Injectable, inject } from '@angular/core'
import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { CrtdlProcessingPipelineService } from '../CrtdlProcessingPipeline.service'
import { NavigationHelperService } from '../NavigationHelper.service'
import { SnackbarMessageService } from '../SnackbarMessage.service'
import { CheckAndUpgradeCCDLService } from '../Upgrade/CheckAndUpgradeCCDL.service'
import { FileUploadService } from './FileUpload.service'

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly fileUploadService = inject(FileUploadService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)
  private readonly checkAndUpgradeCCDLService = inject(CheckAndUpgradeCCDLService)
  private readonly crtdlProcessingPipelineService = inject(CrtdlProcessingPipelineService)
  private readonly navigationHelperService = inject(NavigationHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Reads the CRTDL file.
   * @param {File} file
   */
  public uploadCRTDL(file: File): void {
    if (file) {
      this.fileUploadService.readFile(file, this.onReaderLoad.bind(this))
    }
  }

  /**
   * Parses the read file and translates it.
   * @param {string | ArrayBuffer | null} result
   */
  private onReaderLoad(result: string | ArrayBuffer | null): void {
    const importedQuery = JSON.parse(result as string)
    this.uploadAndTranslate(importedQuery)
  }

  /**
   * Upgrades and processes the CRTDL.
   * @param {CRTDLData} crtdl
   */
  public uploadAndTranslate(crtdl: CRTDLData): void {
    const preUpgraded = this.checkAndUpgradeCCDLService.checkAndUpgradeCCDL(crtdl)
    this.crtdlProcessingPipelineService.process(preUpgraded).subscribe(() => {
      this.snackbarMessageService.dataDefinitionUploadSuccess()
      this.navigationHelperService.navigateToDataQueryCohortDefinition()
    })
  }
}
