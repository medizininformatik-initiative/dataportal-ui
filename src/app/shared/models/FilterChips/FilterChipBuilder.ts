import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipData } from './FilterChipData';
import { FilterChipPropertyData } from './FilterChipPropertyData';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction';

export class FilterChipBuilder {
  private type: FilterTypes | TimeRestrictionType | string | Display;
  private data: FilterChipPropertyData[] = [];

  constructor(type: FilterTypes | TimeRestrictionType | string | Display) {
    this.type = type;
  }

  public addData(id: string, text: any, expanded: boolean = false): this {
    this.data.push({ id, text, expanded });
    return this;
  }

  public buildFilterChip(): FilterChipData {
    return {
      type: this.type,
      data: this.data,
    };
  }
}
