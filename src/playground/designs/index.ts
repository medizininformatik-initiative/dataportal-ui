import { Type } from '@angular/core'

export interface Design {
  designer: string
  name: string
  title: string
  load: () => Promise<Type<unknown>>
}

// Every design registers here. Route: /playground/designs/<designer>/<name>
export const designs: Design[] = [
  {
    designer: 'example',
    name: 'hello',
    title: 'Hello',
    load: () => import('./example/hello/hello.component').then((m) => m.HelloComponent),
  },
]
