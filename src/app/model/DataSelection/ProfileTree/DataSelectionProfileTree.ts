import { DataSelectionProfileTreeNode } from './DataSelectionProfileTreeNode'
import { DataSelectionProfileTreeRoot } from './DataSelectionProfileTreeRoot'

export class DataSelectionProfileTree {
  private treeRoot: DataSelectionProfileTreeRoot
  private treeNode: DataSelectionProfileTreeNode[] = []

  /**
   * Creates a new DataSelectionProfileTree.
   *
   * @param treeRoot
   * @param treeNode
   */
  constructor(treeRoot: DataSelectionProfileTreeRoot, treeNode: DataSelectionProfileTreeNode[]) {
    this.treeRoot = treeRoot
    this.treeNode = treeNode
  }

  public getTreeRoot(): DataSelectionProfileTreeRoot {
    return this.treeRoot
  }

  /**
   * Sets the tree root.
   *
   * @param treeRoot
   */
  public setTreeRoot(treeRoot: DataSelectionProfileTreeRoot): void {
    this.treeRoot = treeRoot
  }

  public getTreeNode(): DataSelectionProfileTreeNode[] {
    return this.treeNode
  }

  /**
   * Sets the tree node.
   *
   * @param treeNode
   */
  public setTreeNode(treeNode: DataSelectionProfileTreeNode[]): void {
    this.treeNode = treeNode
  }
}
