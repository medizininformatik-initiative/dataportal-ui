export class ObjectHelper {
  /**
   * Creates a deep copy of the given object.
   *
   * @param object
   */
  public static clone<T>(object: T): T {
    if (!object) {
      return object
    }

    return JSON.parse(JSON.stringify(object))
  }

  /**
   * Compares two objects for deep equality.
   *
   * @param object1
   * @param object2
   */
  public static equals(object1: any, object2: any): boolean {
    if (!object1 || !object2) {
      return false
    }

    return JSON.stringify(object1) === JSON.stringify(object2)
  }

  /**
   * Checks whether the value is a number.
   *
   * @param value
   */
  public static isNumber(value: number): boolean {
    return !!value || value === 0
  }
}
