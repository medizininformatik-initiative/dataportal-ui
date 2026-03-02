import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry';
import { TableData } from '../TableData';

export interface TableAdapterData<T extends AbstractListEntry> {
  adapt: (data: T[]) => TableData
}
