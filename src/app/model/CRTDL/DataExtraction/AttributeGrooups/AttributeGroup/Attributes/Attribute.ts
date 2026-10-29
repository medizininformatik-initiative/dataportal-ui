import { AttributesData } from 'src/app/model/Interface/AttributesData'

export class Attributes {
  public attributeRef: string
  public mustHave: boolean
  public linkedGroups: string[]

  constructor(attributeRef: string, mustHave: boolean, linkedGroups: string[]) {
    this.attributeRef = attributeRef
    this.mustHave = mustHave
    this.linkedGroups = linkedGroups
  }

  public getLinkedGroups(): string[] {
    return this.linkedGroups
  }

  public setLinkedGroups(linkedGroups: string[]): void {
    this.linkedGroups = linkedGroups
  }

  public getAttributeRef(): string {
    return this.attributeRef
  }

  public setAttributeRef(value: string): void {
    this.attributeRef = value
  }

  public getMustHave(): boolean {
    return this.mustHave
  }

  public setMustHave(value: boolean): void {
    this.mustHave = value
  }

  public static fromJson(json: AttributesData): Attributes {
    return new Attributes(json.attributeRef, json.mustHave, json.linkedGroups)
  }
}
