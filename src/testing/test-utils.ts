import { render as atlRender, RenderComponentOptions } from '@testing-library/angular';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

export async function render<T>(component: any, options: RenderComponentOptions<T> = {}) {
  return atlRender(component, {
    providers: [provideNoopAnimations()],
    ...options,
  });
}
