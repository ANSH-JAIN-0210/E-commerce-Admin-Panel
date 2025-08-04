import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  ViewChild,
  HostListener,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AdminService } from '../services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @Input() name: string = '';
  isDesktop = false;
  isDrawerInitialized = false;
  @ViewChild('drawer') drawer!: MatDrawer;
  drawerMode: 'side' | 'over' = 'side';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private AdminService: AdminService,
    private snackBar : MatSnackBar
  ) {}

  ngOnInit() {
    this.isDesktop = window.innerWidth > 768;
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.drawerMode = result.matches ? 'over' : 'side';
      });
    this.getAdminProfile();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeDrawer();
    }, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth > 768;
    this.setDrawerMode();
  }

  private initializeDrawer() {
    if (this.drawer) {
      this.isDrawerInitialized = true;
      this.setDrawerMode();

      this.cdr.detectChanges();
    } else {
      setTimeout(() => {
        this.initializeDrawer();
      }, 50);
    }
  }

  setDrawerMode() {
    if (this.drawer && this.isDrawerInitialized) {
      try {
        if (this.isDesktop) {
          this.drawer.open();
        } else {
          this.drawer.close();
        }
      } catch (error) {
        console.warn('Error setting drawer mode:', error);
      }
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
    if (!this.isDesktop && this.drawer) {
      this.drawer.close();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out Successfully', 'Close', {
      duration: 3000,
    });
  }

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
  getAdminProfile() {
    this.AdminService.getAdminProfile().subscribe({
      next: (adminData) => {
        this.name = adminData.admin.name;
        console.log('Admin profile fetched:', adminData);
      },
      error: (error) => {
        console.error('Error fetching admin profile:', error);
      },
    });
  }
}
