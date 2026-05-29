import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})

export class App {
  protected readonly title = signal('BORALI');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => {
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursorRing');
        if (!cursor || !ring) return;

        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;

        const onMove = (e: MouseEvent) => {
          cursor.style.left = `${e.clientX}px`;
          cursor.style.top = `${e.clientY}px`;
          ringX += (e.clientX - ringX) * 0.22;
          ringY += (e.clientY - ringY) * 0.22;
          ring.style.left = `${ringX}px`;
          ring.style.top = `${ringY}px`;
        };

        document.addEventListener('mousemove', onMove, { passive: true });
        this.destroyRef.onDestroy(() => {
          document.removeEventListener('mousemove', onMove);
        });
      });
    });
  }
}
