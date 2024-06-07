import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { PreviewComponent } from './preview/preview.component';
import { APP_MONACO_BASE_HREF } from './editor/code-editor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [{ provide: APP_MONACO_BASE_HREF, useValue: 'assets/vs' }],
  imports: [RouterOutlet, FormsModule, CommonModule, EditorComponent, PreviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'monaco-editor';
}
