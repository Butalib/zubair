import { Injectable, signal } from '@angular/core';

export interface SidebarNavItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarNavItem[];
  section?: string;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }
}
