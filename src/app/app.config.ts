import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';

import {
  EyeInvisibleOutline,
  EyeOutline,
  UserOutline,
  LockOutline,
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      NzIconModule.forRoot([
        EyeInvisibleOutline,
        EyeOutline,
        UserOutline,
        LockOutline,
      ])
    ),
  ],
};
