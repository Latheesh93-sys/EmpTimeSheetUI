import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient,withFetch,withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../app/Interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
   provideHttpClient(withFetch()),provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr()
  ]
};
