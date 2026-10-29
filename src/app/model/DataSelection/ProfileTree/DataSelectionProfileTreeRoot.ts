import { DataSelectionProfileTreeNode } from './DataSelectionProfileTreeNode'

export class DataSelectionProfileTreeRoot {
  private name: string
  private module: string
  private url: string
  private children: DataSelectionProfileTreeNode[] = []

  /**
   * Creates a new DataSelectionProfileTreeRoot.
   *
   * @param name
   * @param module
   * @param url
   * @param children
   */
  constructor(name: string = 'Root', module: string = 'no-module', url: string = 'no-url', children: DataSelectionProfileTreeNode[] = []) {
    this.name = name
    this.module = module
    this.url = url
    this.children = children
  }

  public getName(): string {
    return this.name
  }

  /**
   * Sets the name.
   *
   * @param name
   */
  public setName(name: string) {
    this.name = name
  }

  public getModule(): string {
    return this.module
  }

  /**
   * Sets the module.
   *
   * @param value
   */
  public setModule(value: string) {
    this.module = value
  }

  public getUrl(): string {
    return this.url
  }

  /**
   * Sets the url.
   *
   * @param value
   */
  public setUrl(value: string) {
    this.url = value
  }

  public getChildren(): DataSelectionProfileTreeNode[] {
    return this.children
  }

  /**
   * Sets the children.
   *
   * @param nodes
   */
  public setChildren(nodes: DataSelectionProfileTreeNode[]) {
    if (Array.isArray(nodes)) {
      this.children = nodes
    } else {
      console.error('Children must be an array of DataSelectionProfileTreeNode.')
    }
  }

  /**
   * Adds the child.
   *
   * @param node
   */
  public addChild(node: DataSelectionProfileTreeNode): void {
    this.children.push(node)
  }
}
