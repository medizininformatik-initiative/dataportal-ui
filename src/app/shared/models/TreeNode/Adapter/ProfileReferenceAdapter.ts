import { v4 as uuidv4 } from 'uuid'
import { TreeNode } from '../TreeNodeInterface'

export class ProfileReferenceAdapter {
  public static adapt(referencedProfileUrls: string[]): TreeNode[] {
    const nodes: TreeNode[] = []
    referencedProfileUrls.forEach((url: string) => {
      const node: TreeNode = {
        id: uuidv4(),
        data: {
          name: ProfileReferenceAdapter.normalizeRefrenceUrl(url),
          display: ProfileReferenceAdapter.normalizeRefrenceUrl(url),
          description: ProfileReferenceAdapter.normalizeRefrenceUrl(url),
          selectable: true,
          isCheckboxSelected: false,
          isDisabled: true,
        },
        children: [],
        originalEntry: url,
      }
      nodes.push(node)
    })
    return nodes
  }

  public static normalizeRefrenceUrl(url: string): string {
    const lastPart = url.split('/').pop()
    const words = lastPart.split('-')
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    const result = capitalizedWords.join(' ')
    return result
  }
}
