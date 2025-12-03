import { AbstractProfileFilter } from './Filter/AbstractProfileFilter';
import { CloneDisplayData } from '../../Utilities/DisplayData/CloneDisplayData';
import { Display } from './Display';
import { ProfileFields } from './Fields/ProfileFields';
import { ProfileReference } from './Reference/ProfileReference';

export class DataSelectionProfile {
  private id: string;
  private display: Display;
  private profileFields: ProfileFields;
  private filters: AbstractProfileFilter[] = [];
  private label: Display;
  private reference: ProfileReference;
  private url: string;

  constructor(
    id: string,
    url: string,
    display: Display,
    profileFields: ProfileFields,
    filters: AbstractProfileFilter[] = [],
    reference: ProfileReference,
    label: Display
  ) {
    this.id = id;
    this.url = url;
    this.display = display;
    this.profileFields = profileFields;
    this.filters = filters;
    this.reference = reference;
    this.label = label;
  }

  public getLabel(): Display {
    return this.label;
  }

  public setLabel(label: string): void {
    const newLabel = CloneDisplayData.deepCopyDisplayData(this.getLabel());
    newLabel.setOriginal(label);
    newLabel.getTranslations().forEach((translation) => {
      translation.setValue(label);
    });
    this.label = newLabel;
  }

  public getId(): string {
    return this.id;
  }

  public getUrl(): string {
    return this.url;
  }

  public setUrl(value: string): void {
    this.url = value;
  }

  public getDisplay(): Display {
    return this.display;
  }

  public setDisplay(value: Display): void {
    this.display = value;
  }

  public getProfileFields(): ProfileFields {
    return this.profileFields;
  }

  public setProfileFields(profileFields: ProfileFields): void {
    this.profileFields = profileFields;
  }

  public getFilters(): AbstractProfileFilter[] {
    return this.filters;
  }

  public setFilters(value: AbstractProfileFilter[]): void {
    this.filters = value;
  }

  public setFilter(filter: AbstractProfileFilter): void {
    const index = this.filters.findIndex((f) => f.getName() === filter.getName());
    if (index !== -1) {
      this.filters[index] = filter;
    } else {
      this.filters.push(filter);
    }
  }

  public getReference(): ProfileReference {
    return this.reference;
  }

  public setReference(reference: ProfileReference): void {
    this.reference = reference;
  }
}
