import { Component } from '@angular/core';

/**
 * HomeLayoutComponent
 * ─────────────────────────────────────────────────────
 * Layout wrapper for the home page.
 * Shares the same Navbar + Sidebar (via main-layout or directly)
 * but provides a full-width content area without inner sidebars.
 *
 * Route structure:
 *   /home  →  HomeLayoutComponent  →  <router-outlet>  →  HomePageComponent
 */
@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.scss',
  standalone: false
})
export class HomeLayoutComponent {}
