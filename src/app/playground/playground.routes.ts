import { Routes } from '@angular/router'
import { designs } from './designs'
import { galleryComponents } from './gallery/gallery-components'

export const playgroundRoutes: Routes = [
  {
    path: 'playground',
    loadComponent: () =>
      import('./playground-shell.component').then((m) => m.PlaygroundShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: `gallery/${galleryComponents[0].page}` },
      {
        path: 'gallery',
        loadComponent: () => import('./gallery/gallery.component').then((m) => m.GalleryComponent),
      },
      {
        path: 'gallery/:component',
        loadComponent: () => import('./gallery/gallery.component').then((m) => m.GalleryComponent),
      },
      {
        path: 'designs',
        loadComponent: () => import('./design-frame.component').then((m) => m.DesignFrameComponent),
        children: designs.map((d) => ({ path: `${d.designer}/${d.name}`, loadComponent: d.load })),
      },
    ],
  },
]
