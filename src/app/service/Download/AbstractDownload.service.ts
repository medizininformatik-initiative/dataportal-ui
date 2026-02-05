import { Injectable } from '@angular/core';

/**
 * Abstract base class for download services.
 * Provides common functionality for creating filenames and downloading files.
 */
@Injectable()
export abstract class AbstractDownloadService {
  /**
   * Abstract method to be implemented by derived classes.
   * Each service should define its own download logic.
   * @param filename - Optional custom filename (without extension)
   */
  public abstract download(filename?: string): void;

  /**
   * Generates a filename with timestamp.
   * If a custom filename is provided, returns it; otherwise generates a default filename.
   * @param customFilename - Optional custom filename
   * @param prefix - Prefix for the default filename (e.g., 'CRTDL', 'validation-errors')
   * @param locale - Locale for date formatting (default: 'de-DE')
   * @returns The filename without extension
   * @protected
   */
  protected createFilename(
    customFilename: string | undefined,
    prefix: string,
    locale: string = 'de-DE'
  ): string {
    if (customFilename && customFilename.length > 0) {
      return customFilename;
    }
    return this.generateTimestampedFilename(prefix, locale);
  }

  /**
   * Generates a filename with current date and time.
   * Format: 'PREFIX_DD.MM.YYYY_HH-MM-SS' for 'de-DE' locale
   * or 'PREFIX_YYYY-MM-DDTHH-MM-SS' for ISO format
   * @param prefix - Prefix for the filename
   * @param locale - Locale for date formatting ('de-DE' or 'iso')
   * @returns The generated filename
   * @protected
   */
  protected generateTimestampedFilename(prefix: string, locale: string = 'de-DE'): string {
    const now = new Date();

    if (locale === 'iso') {
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      return `${prefix}-${timestamp}`;
    }

    const date = now.toLocaleDateString(locale);
    const time = now.toLocaleTimeString(locale).replace(/:/g, '-');
    return `${prefix}_${date}_${time}`;
  }

  /**
   * Creates a Blob from data.
   * @param data - Data to convert to Blob (string or object)
   * @param type - MIME type of the blob (default: 'application/json')
   * @returns A Blob containing the data
   * @protected
   */
  protected createBlob(data: string | object, type: string = 'application/json'): Blob {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return new Blob([content], { type });
  }

  /**
   * Triggers a file download using the browser's native download mechanism.
   * @param blob - The blob to download
   * @param filename - The filename (including extension)
   * @protected
   */
  protected triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Creates a JSON blob from an object.
   * @param data - Object to convert to JSON blob
   * @returns A Blob containing the JSON data
   * @protected
   */
  protected createJsonBlob(data: object): Blob {
    return this.createBlob(data, 'application/json');
  }

  /**
   * Creates a text blob from a string.
   * @param data - String to convert to text blob
   * @returns A Blob containing the text data
   * @protected
   */
  protected createTextBlob(data: string): Blob {
    return this.createBlob(data, 'text/plain;charset=utf-8');
  }
}
