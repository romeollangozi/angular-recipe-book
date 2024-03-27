import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthServiceService } from '../auth/auth-service.service';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() emitSelectedLink = new EventEmitter<string>();
  authUser$: Subscription;
  isLoggedIn: boolean = false;
  constructor(
    private dataStoreService: DataStorageService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.authService.user.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }
  onClick(selectedLink: string) {
    this.emitSelectedLink.emit(selectedLink);
  }

  onSaveData() {
    this.dataStoreService.storeRecipes();
  }

  onFetchData() {
    this.dataStoreService.getRecipes().pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.authUser$.unsubscribe();
  }

  onClickLogout() {
    this.authService.logOut();
  }
}
