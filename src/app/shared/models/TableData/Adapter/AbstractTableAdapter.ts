import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry';
import { TableData } from '../TableData';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TableAdapterData } from './TableAdapterData';

export abstract class AbstractTableAdapter<T extends AbstractListEntry>
  implements TableAdapterData<T>
{
  /**
   * Adapts a list of entries to a TableData object, which can be used to display the data in a table format.
   * @param data
   * @returns
   */
  public adapt(data: T[]): TableData {
    const header = this.buildHeaders();
    const rows = this.buildRows(data);
    this.validateColumnCount(header, rows);
    return { header, body: { rows } };
  }

  /**
   * Validates that every row contains the same number of cells as there are headers.
   * @param header
   * @param rows
   * @throws {Error} When a row's cell count does not match the header count.
   */
  protected validateColumnCount(header: TableHeaderData, rows: TableRowData[]): void {
    const headerCount = header.headers.length;
    rows.forEach((row, index) => {
      if (row.cells.length !== headerCount) {
        throw new Error(
          `Row ${index} has ${row.cells.length} cell(s) but expected ${headerCount} to match the number of headers.`
        );
      }
    });
  }

  /**
   * Builds the headers for the table.
   * This method must be implemented by subclasses to define the specific headers for their data type.
   * @return {TableHeaderData} The headers for the table.
   * @abstract
   */
  protected abstract buildHeaders(): TableHeaderData;

  /**
   * Builds the rows for the table based on the provided list of entries.
   * This method must be implemented by subclasses to define how the data should be transformed into rows.
   * @param {T[]} data - The list of entries to be adapted into table rows.
   * @return {TableRowData[]} The rows for the table.
   * @abstract
   */
  protected abstract buildRows(data: T[]): TableRowData[];
}
