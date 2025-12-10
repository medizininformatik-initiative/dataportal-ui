import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'num-token-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-filter.component.html',
  styleUrls: ['./token-filter.component.scss'],
})
export class TokenFilterComponent implements OnInit, OnChanges {
  @Input() tokenFilter: ProfileTokenFilter;
  @Output() tokenFilterChanged = new EventEmitter<ProfileTokenFilter>();
  tabChanged = false;
  selectedConcepts: Concept[] = [];
  constructor() {}

  ngOnChanges(): void {
    this.selectedConcepts = this.tokenFilter.getSelectedTokens();
  }

  ngOnInit(): void {
    this.selectedConcepts = this.tokenFilter.getSelectedTokens();
  }

  /**
   * Updates the selected concepts in the token filter and emits the updated token filter instance.
   * @param concepts - The updated list of selected concepts.
   */
  public updateSelectedConcepts(concepts: Concept[]): void {
    const newProfileTokenFilter = this.createProfileTokenFilterInstance(concepts);
    this.tokenFilterChanged.emit(newProfileTokenFilter);
  }

  private createProfileTokenFilterInstance(concepts: Concept[]): ProfileTokenFilter {
    return new ProfileTokenFilter(
      this.tokenFilter.getId(),
      this.tokenFilter.getName(),
      this.tokenFilter.getType(),
      this.tokenFilter.getValueSetUrls(),
      concepts
    );
  }

  public onTabChange(): void {
    this.tabChanged = !this.tabChanged;
  }
}
