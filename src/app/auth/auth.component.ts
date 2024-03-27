import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from './auth-service.service';
import { AuthResponseData } from './user.type';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  private onCloseSub: Subscription;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private componentFactory: ComponentFactoryResolver
  ) {}
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    let authObs: Observable<AuthResponseData>;
    if (!form.valid) return;
    this.isLoading = true;
    const user = { ...form.value };
    if (!this.isLoginMode) {
      authObs = this.authService.signup(user);
    } else {
      authObs = this.authService.login(user);
    }
    authObs.subscribe({
      next: (data) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        this.showErrorAlert(err);
        this.isLoading = false;
      },
    });
    form.reset();
  }

  ngOnDestroy() {
    if (this.onCloseSub) {
      this.onCloseSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactory.resolveComponentFactory(AlertComponent);

    this.alertHost.viewContainerRef.clear();

    const component =
      this.alertHost.viewContainerRef.createComponent(alertCmpFactory);

    component.instance.message = message;
    this.onCloseSub = component.instance.closed.subscribe(() => {
      this.alertHost.viewContainerRef.clear();
      this.onCloseSub.unsubscribe();
    });
  }
}
