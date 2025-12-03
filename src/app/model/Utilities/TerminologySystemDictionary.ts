import { Display } from '../DataSelection/Profile/Display';
import { DisplayData } from '../Interface/DisplayData';

export type CodeSystemEntry = {
  url: string
  display: DisplayData
};

export class TerminologySystemDictionary {
  private static instance: TerminologySystemDictionary;
  private static urlToNameMap: Map<string, Display> = new Map();
  private static nameToUrlMap: Record<string, Display> = {};

  private constructor(entries: CodeSystemEntry[]) {
    TerminologySystemDictionary.nameToUrlMap = this.createDictionary(entries);
    TerminologySystemDictionary.urlToNameMap = this.createReverseLookup(
      TerminologySystemDictionary.nameToUrlMap
    );
  }

  public static initialize(entries: CodeSystemEntry[]): void {
    if (!TerminologySystemDictionary.instance) {
      TerminologySystemDictionary.instance = new TerminologySystemDictionary(entries);
    }
  }

  private createDictionary(entries: CodeSystemEntry[]): Record<string, Display> {
    return entries.reduce((acc, entry) => {
      const key = entry.url;
      acc[key] = Display.fromJson(entry.display);
      return acc;
    }, {} as Record<string, Display>);
  }

  private createReverseLookup(dict: Record<string, Display>): Map<string, Display> {
    const reverseMap = new Map<string, Display>();
    Object.entries(dict).forEach(([key, value]) => {
      reverseMap.set(key, value);
    });
    return reverseMap;
  }

  public static getDictionary(): Record<string, Display> {
    if (!TerminologySystemDictionary.instance) {
      throw new Error('CodeSystemDictionary is not initialized. Please call initialize() first.');
    }
    return TerminologySystemDictionary.nameToUrlMap;
  }

  public static getNameByUrl(url: string): Display | undefined {
    if (!TerminologySystemDictionary.instance) {
      throw new Error('CodeSystemDictionary is not initialized. Please call initialize() first.');
    }
    return TerminologySystemDictionary.urlToNameMap.get(url);
  }
}
