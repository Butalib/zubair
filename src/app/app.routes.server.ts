import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // These pages load data from the private API during initialization. Rendering
  // them on the server would block SSR when that API is unavailable to Node.
  {
    path: 'home',
    renderMode: RenderMode.Client
  },
  {
    path: 'categories',
    renderMode: RenderMode.Client
  },
  {
    path: 'products',
    renderMode: RenderMode.Client
  },
  {
    path: 'shop/classification/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'shop/subclass/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'brands',
    renderMode: RenderMode.Client
  },
  {
    path: 'brands/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
