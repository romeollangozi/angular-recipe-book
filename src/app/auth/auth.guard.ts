import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const callBackURL = inject(Router).createUrlTree(['/auth']);
  return inject(AuthServiceService).user.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;
      console.log(isAuth);
      if (isAuth) return true;
      return callBackURL;
    })
  );
};
