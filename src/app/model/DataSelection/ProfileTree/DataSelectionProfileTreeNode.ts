import { Display } from '../Profile/Display'

export class DataSelectionProfileTreeNode {
  private id: string
  private name: string
  private display: Display
  private displayFieldsInfo: Display
  private readonly description: Display
  private module: string
  private url: string
  private leaf: boolean
  private selectable: boolean
  private children: DataSelectionProfileTreeNode[] = []
  private selected = false // New property to track selection status

  /**
   * Creates a new DataSelectionProfileTreeNode.
   *
   * @param id
   * @param name
   * @param display
   * @param displayFieldsInfo
   * @param module
   * @param url
   * @param leaf
   * @param selectable
   * @param children
   */
  constructor(
    id: string,
    name: string,
    display: Display,
    displayFieldsInfo: Display,
    module: string,
    url: string,
    leaf: boolean,
    selectable: boolean,
    children: DataSelectionProfileTreeNode[]
  ) {
    this.id = id
    this.name = name
    this.display = display
    this.displayFieldsInfo = displayFieldsInfo
    this.module = module
    this.url = url
    this.leaf = leaf
    this.selectable = selectable
    this.children = children
  }

  public isSelected(): boolean {
    return this.selected
  }

  /**
   * Sets the selected.
   *
   * @param selected
   */
  public setSelected(selected: boolean): void {
    this.selected = selected
  }

  public getId(): string {
    return this.id
  }

  /**
   * Sets the id.
   *
   * @param id
   */
  public setId(id: string): void {
    this.id = id
  }

  public getName(): string {
    return this.name
  }

  /**
   * Sets the name.
   *
   * @param name
   */
  public setName(name: string): void {
    this.name = name
  }

  public getDisplay(): Display {
    return this.display
  }

  /**
   * Sets the display.
   *
   * @param display
   */
  public setDisplay(display: Display): void {
    this.display = display
  }

  public getDisplayFieldsInfo(): Display {
    return this.displayFieldsInfo
  }

  /**
   * Sets the display fields info.
   *
   * @param displayFieldsInfo
   */
  public setDisplayFieldsInfo(displayFieldsInfo: Display): void {
    this.displayFieldsInfo = displayFieldsInfo
  }

  public getModule(): string {
    return this.module
  }

  /**
   * Sets the module.
   *
   * @param module
   */
  public setModule(module: string): void {
    this.module = module
  }

  public getUrl(): string {
    return this.url
  }

  /**
   * Sets the url.
   *
   * @param url
   */
  public setUrl(url: string): void {
    this.url = url
  }

  public getLeaf(): boolean {
    return this.leaf
  }

  /**
   * Sets the leaf.
   *
   * @param leaf
   */
  public setLeaf(leaf: boolean): void {
    this.leaf = leaf
  }

  public getSelectable(): boolean {
    return this.selectable
  }

  /**
   * Sets the selectable.
   *
   * @param selectable
   */
  public setSelectable(selectable: boolean): void {
    this.selectable = selectable
  }

  public getChildren(): DataSelectionProfileTreeNode[] {
    return this.children
  }

  /**
   * Sets the children.
   *
   * @param children
   */
  public setChildren(children: DataSelectionProfileTreeNode[]): void {
    this.children = children
  }
}
