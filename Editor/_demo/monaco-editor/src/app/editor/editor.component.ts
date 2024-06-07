import { Component, ElementRef, ViewChild } from '@angular/core';
import { CodeEditorService } from './code-editor.service';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [],
  template: `<div #editorContainer class="editor-container"></div>`,
  styles: [`
    .editor-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
    }
  `]
})
export class EditorComponent {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  constructor(private codeEditorService: CodeEditorService) { }

  ngAfterViewInit(): void {
    this.codeEditorService.initializeEditor(this.editorContainer.nativeElement, {
      language: 'javascript',
      theme: 'vs-dark'
    });
  }

  ngOnDestroy(): void {
    this.codeEditorService.disposeEditor();
  }
}
