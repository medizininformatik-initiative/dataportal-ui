import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'

export abstract class AbstractMenuItemsService<TArgs extends unknown[] = []> {
  public abstract getMenuItems(...args: TArgs): MenuItemInterface[]
}
