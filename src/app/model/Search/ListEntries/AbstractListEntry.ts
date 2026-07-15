export abstract class AbstractListEntry {
  /**
   * @param {string} id
   */
  protected readonly id: string
  constructor(id: string) {
    this.id = id
  }

  /**
   * Returns the ID of the list entry.
   * @returns {string} The ID of the list entry.
   */
  public getId(): string {
    return this.id
  }
}
