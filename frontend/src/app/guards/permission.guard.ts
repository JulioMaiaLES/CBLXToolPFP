import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { StorageService } from '@services/storage.service';
import { firstValueFrom } from 'rxjs';

export const permissionGuard: CanActivateFn = async (route) => {
  const storage = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!storage.myself.id) {
    const user = await firstValueFrom(authService.getMe());
    storage.myself = user;
  }

  const path = route.routeConfig?.path;
  const access = storage.myself.level_access.find(
    (level) => level.router === path
  );

  if (access && access.read) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
