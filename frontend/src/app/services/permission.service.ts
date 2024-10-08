import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILevelAccess } from '@models/user';
import { StorageService } from './storage.service';

type Key = keyof ILevelAccess;

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  private userAccess = this.storage.myself.level_access;

  checkLevelAccess(path?: string) {
    if (!path) {
      path = this.router.url.split('/')[1];
    }

    const access = this.userAccess.find((access) => access.router === path);
    const activedPermissions: Key[] = [];
    if (!access) return activedPermissions;

    Object.keys(access).forEach((key: string) => {
      const permissions: Key[] = ['read', 'create', 'update', 'delete'];
      if (!permissions.includes(key as Key)) return;
      if (access[key as Key]) {
        activedPermissions.push(key as Key);
      }
    });

    return activedPermissions;
  }
}
