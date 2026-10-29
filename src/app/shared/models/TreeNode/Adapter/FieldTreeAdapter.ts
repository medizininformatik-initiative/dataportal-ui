import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField'
import { TreeNode } from '../TreeNodeInterface'

export class FieldsTreeAdapter {
  public static fromTree(trees: BasicField[]): TreeNode[] {
    const result = []
    trees.forEach((tree: BasicField) => {
      result.push(FieldsTreeAdapter.toTreeNode(tree))
    })
    return result
  }

  public static toTreeNode(node: BasicField): TreeNode {
    return {
      id: node?.getElementId(),
      data: {
        name: node.getDisplay(),
        display: node.getDisplay(),
        description: node.getDescription(),
        selectable: true,
        isCheckboxSelected: node.getIsSelected() || node.getIsRequired(),
        isDisabled: !node.getIsRequired(),
      },
      children: node?.getChildren()?.map((child: any) => FieldsTreeAdapter.toTreeNode(child)),
      originalEntry: node,
    }
  }
}
