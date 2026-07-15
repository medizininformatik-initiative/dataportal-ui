import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component'
import { ActivatedRoute } from '@angular/router'
import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { AsyncPipe } from '@angular/common'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core'
import { createTestProfileEntries } from './TestProfileEntries'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileTreeNode } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTreeNode'
import { DataSelectionProviderService } from '../../services/DataSelectionProvider.service'
import { DataSelectionTreeAdapter } from 'src/app/shared/models/TreeNode/Adapter/DataSelectionProfileTreeAdapter'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { map, Observable, Subscription } from 'rxjs'
import { MatBadge } from '@angular/material/badge'
import { MatTooltip } from '@angular/material/tooltip'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ProfileEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ProfileEntryAdapter'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { SelectedDataSelectionProfileService } from 'src/app/service/DataSelection/Selection/SelectedDataSelectionProfile.service'
import { SelectedProfileService } from 'src/app/service/DataSelection/Selection/SelectedProfileEntry.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import {
  DisplayTranslationPipe,
  TableComponent,
} from 'src/app/shared/components/shared-components.module'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { TranslateModule } from '@ngx-translate/core'
import { TreeComponent } from '../../../../shared/components/tree/tree.component'
import { TreeNode } from 'src/app/shared/models/TreeNode/TreeNodeInterface'
import { createTestProfileEntryDetails } from 'src/app/shared/components/list-item-details-generic/createTestProfileEntryDetails'
import { ListItemDetailsGenericComponent } from 'src/app/shared/components/list-item-details-generic/list-item-details-generic.component'
import {
  ListItemDetailsData,
  ListItemDetailsRelative,
  ProfileListItemDetailsAdapter,
} from 'src/app/shared/components/list-item-details/ListItemDetailsData'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { ListItemDetailsGenericSectionsComponent } from 'src/app/shared/components/list-item-details-generic/list-item-details-generic-sections/list-item-details-generic-sections.component'

@Component({
  selector: 'num-search-data-selection',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderDescriptionComponent,
    TreeComponent,
    ActionBarComponent,
    ButtonComponent,
    MatBadge,
    MatTooltip,
    AsyncPipe,
    TranslateModule,
    TableComponent,
    ListItemDetailsGenericComponent,
  ],
})
export class SearchDataSelectionComponent implements OnInit, OnDestroy {
  private loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private activeDataSelectionService = inject(ActiveDataSelectionService)
  private selectedDataSelectionProfileService = inject(SelectedDataSelectionProfileService)
  private navigationHelperService = inject(NavigationHelperService)
  private activeRoute = inject(ActivatedRoute)
  private appSettingsProviderService = inject(AppSettingsProviderService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private selectedProfileService = inject(SelectedProfileService)

  trees: TreeNode[]

  dataSelectionProfileSubscription: Subscription

  selectedDataSelectionProfileUrls: Set<string> = new Set()

  $dataSelectionProfileArray: Observable<DataSelectionProfile[]>

  $dataSelectionProfileTreeNodeArray: Observable<DataSelectionProfileTreeNode[]>

  $dataSelectionProfileEntryArray: Observable<string[]>

  emailLink: string

  tableData: TableData

  adaptedDetailsData = signal<ListItemDetailsData | undefined>(undefined)

  constructor() {}
  ngOnInit(): void {
    this.$dataSelectionProfileArray = this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => dataSelection.getProfiles()))
    this.$dataSelectionProfileTreeNodeArray =
      this.selectedDataSelectionProfileService.getSelectedProfiles()

    this.$dataSelectionProfileEntryArray = this.selectedProfileService
      .getSelectedProfiles()
      .pipe(map((profiles) => profiles.map((profile) => profile.getId())))

    this.handleSelectedItemsSubscription()
    const tree = this.activeRoute.snapshot.data.preLoadDataSelectionData
    const rootNode = DataSelectionTreeAdapter.fromTree(tree.getTreeNode())
    this.trees = rootNode
    this.emailLink = this.appSettingsProviderService.getEmail()
    const testProfiles = createTestProfileEntries()
    this.tableData = new ProfileEntryAdapter().adapt(testProfiles)
  }

  /**
   * Recursively checks if each node is selected and updates its selection status.
   *
   * @param node The root node to start the update from.
   */
  private updateSelectionStatus(node: DataSelectionProfileTreeNode): void {
    const isSelected = this.selectedDataSelectionProfileService
      .getSelectedUrls()
      .includes(node.getUrl())
    node.setSelected(isSelected)

    node.getChildren().forEach((child) => this.updateSelectionStatus(child))
  }

  ngOnDestroy() {
    this.dataSelectionProfileSubscription?.unsubscribe()
  }

  private handleSelectedItemsSubscription(): void {
    this.selectedDataSelectionProfileService
      .getSelectedProfiles()
      .subscribe((selectedItems: DataSelectionProfileTreeNode[]) => {
        if (selectedItems.length === 0) {
          this.uncheckAllRows()
        }
      })
  }

  private uncheckAllRows(): void {
    if (this.trees && this.trees.length > 0) {
      this.trees.forEach((item) => {
        this.uncheckRowAndChildren(item)
      })
    }
  }

  /**
   * Recursively unchecks the given row and its children.
   *
   * @param item The tree node to be unchecked.
   */
  private uncheckRowAndChildren(item: any): void {
    this.uncheckRow(item)
    if (item.children && item.children.length > 0) {
      item.children.forEach((child: any) => {
        this.uncheckRowAndChildren(child)
      })
    }
  }

  private uncheckRow(item: any): void {
    item.data.isCheckboxSelected = false
  }

  public getDataSelectionProfileData() {
    const dataSelectionProfileUrls = Array.from(this.selectedDataSelectionProfileUrls)
    this.dataSelectionProfileSubscription = this.loadDataSelectionProfilesService
      .loadProfiles(dataSelectionProfileUrls)
      .subscribe((dataSelectionProfiles) => {
        this.selectedDataSelectionProfileUrls.clear()
        this.selectedDataSelectionProfileService.clearSelection()
        dataSelectionProfiles.forEach((dataSelectionProfile) => {
          const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
          this.dataSelectionProviderService.setProfileInDataSelection(
            dataSelectionId,
            dataSelectionProfile
          )
        })
        this.snackbarMessageService.displayAddedToDataSelection()
      })
  }

  public addItemsToStage(node: TreeNode) {
    const originalEntry = node.originalEntry as DataSelectionProfileTreeNode
    this.selectedDataSelectionProfileUrls.add(originalEntry.getUrl())

    const selectedIds = this.selectedDataSelectionProfileService.getSelectedUrls()
    const originalEntryId = node.originalEntry.url
    if (selectedIds.includes(originalEntryId)) {
      this.selectedDataSelectionProfileUrls.delete(originalEntry.getUrl())
      this.selectedDataSelectionProfileService.removeFromSelection(originalEntry)
    } else {
      this.selectedDataSelectionProfileService.addToSelection(originalEntry)
    }
  }

  public onRowSelected(row: TableRowData): void {
    console.log('Row selected:', row)
    const originalEntry = row.originalEntry as ProfileListEntry
    this.selectedDataSelectionProfileUrls.add(originalEntry.getId())
    this.selectedProfileService.addToSelection(row.originalEntry as ProfileListEntry)
  }

  public navigateToDataSelectionEditor() {
    this.navigationHelperService.navigateToDataSelectionEditor()
  }

  getRelatives(row: TableRowData): void {
    const test = createTestProfileEntryDetails()
    row.originalEntry.getId()
    console.log('Row clicked:', row.originalEntry.getId())
    const foundElement = test.find((entry) => entry.getId() === row.originalEntry.getId())
    if (foundElement) {
      const adaptedData = ProfileListItemDetailsAdapter.adapt(foundElement)
      this.adaptedDetailsData.set(adaptedData)
      console.log('Row clicked:', test)
      console.log('Adapted data:', adaptedData)
    }
  }
}
