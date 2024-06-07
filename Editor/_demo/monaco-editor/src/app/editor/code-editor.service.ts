import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  private editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

  constructor() { }

  initializeEditor(element: HTMLElement, options: monaco.editor.IStandaloneEditorConstructionOptions): void {
    this.editorInstance = monaco.editor.create(element, options);
  }

  getEditorInstance(): monaco.editor.IStandaloneCodeEditor | null {
    return this.editorInstance;
  }

  disposeEditor(): void {
    if (this.editorInstance) {
      this.editorInstance.dispose();
      this.editorInstance = null;
    }
  }
}
