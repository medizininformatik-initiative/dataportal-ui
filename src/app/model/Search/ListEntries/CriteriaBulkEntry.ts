import { AbstractListEntry } from './AbstractListEntry';
import { BulkSearchResponseFoundData } from '../../Interface/BulkSearchResponseFoundData';
import { Display } from '../../DataSelection/Profile/Display';
import { TerminologyCode } from '../../Terminology/TerminologyCode';

export class CriteriaBulkEntry extends AbstractListEntry {
  private display: Display;
  private availability: number;
  private context: TerminologyCode;
  private terminology: string;
  private termcodes: TerminologyCode[];
  private kdsModule: string;
  private selectable: boolean;

  constructor(
    id: string,
    display: Display,
    availability: number,
    context: TerminologyCode,
    terminology: string,
    termcodes: TerminologyCode[],
    kdsModule: string,
    selectable: boolean
  ) {
    super(id);
    this.display = display;
    this.availability = availability;
    this.context = context;
    this.terminology = terminology;
    this.termcodes = termcodes;
    this.kdsModule = kdsModule;
    this.selectable = selectable;
  }

  public getDisplay(): Display {
    return this.display;
  }

  public setDisplay(display: Display): void {
    this.display = display;
  }

  public getAvailability(): number {
    return this.availability;
  }

  public setAvailability(availability: number): void {
    this.availability = availability;
  }

  public getContext(): TerminologyCode {
    return this.context;
  }

  public setContext(context: TerminologyCode): void {
    this.context = context;
  }
  public getTerminology(): string {
    return this.terminology;
  }

  public setTerminology(terminology: string): void {
    this.terminology = terminology;
  }
  public getTermCodes(): TerminologyCode[] {
    return this.termcodes;
  }

  public setTermcodes(termcodes: TerminologyCode[]): void {
    this.termcodes = termcodes;
  }
  public getKdsModule(): string {
    return this.kdsModule;
  }

  public setKdsModule(kdsModule: string): void {
    this.kdsModule = kdsModule;
  }
  public isSelectable(): boolean {
    return this.selectable;
  }

  public setSelectable(selectable: boolean): void {
    this.selectable = selectable;
  }

  public static fromJson(json: BulkSearchResponseFoundData): CriteriaBulkEntry {
    const bulkEntry = new CriteriaBulkEntry(
      json.id,
      Display.fromJson(json.display),
      json.availability,
      TerminologyCode.fromJson(json.context),
      json.terminology,
      json.termcodes.map((tc) => TerminologyCode.fromJson(tc)),
      json.kdsModule,
      json.selectable
    );
    return bulkEntry;
  }
}
