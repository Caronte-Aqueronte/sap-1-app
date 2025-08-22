import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EyeInvisibleOutline } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
const icons: IconDefinition[] = [EyeInvisibleOutline];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sap-1-app');
}
