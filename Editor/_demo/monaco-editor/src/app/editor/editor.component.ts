import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { CodeEditorService } from './code-editor.service';

declare const monaco: any;

@Component({
  standalone: true,
  selector: 'app-code-editor',
  template: `<div #editorContainer class="editor-container"></div>`,
  styles: [`
    .editor-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      border: 1px solid blue;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() options: any;
  @Input() @HostBinding('style.height') height: string = '100%';
  @Output() readonly editorInitialized: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('editorContainer', { static: true }) editorContentRef!: ElementRef;

  private destroy$: Subject<void> = new Subject<void>();
  private _editor: any = undefined;
  private _valueSignal = signal<string>('');
  private _disposables: any[] = [];

  onChange = (_: any) => { };
  onTouched = () => { };

  constructor(
    private codeEditorService: CodeEditorService,
    private renderer: Renderer2
  ) {
    effect(() => {
      const value = this._valueSignal();
      if (this._editor && this._editor.getModel()) {
        this._editor.getModel().setValue(value);
      }
    });
  }

  // 双向绑定设置 editor 内容
  writeValue(value: string): void {
    this._valueSignal.set(value || '');
  }

  // 通过 onChange 方法将改变后的值传出，即 ngModelChange
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.codeEditorService
      .getScriptLoadSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded) => {
        if (isLoaded) {
          this.initMonaco();
        }
      });

    // 监听浏览器窗口大小，做 editor 的自适应
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this._editor) {
          this._editor.layout();
        }
      });
  }

  private initMonaco(): void {
    const options = this.options;
    const language = this.options['language'];
    const editorDiv: HTMLDivElement = this.editorContentRef.nativeElement;

    if (!this._editor) {
      this._editor = monaco.editor.create(editorDiv, options);
      this._editor.setModel(monaco.editor.createModel(this._valueSignal(), language));
      this.editorInitialized.emit(this._editor);
      this.renderer.setStyle(
        this.editorContentRef.nativeElement,
        'height',
        this.height
      );
      this.setValueEmitter();
      this._editor.layout();
    }
  }

  private setValueEmitter() {
    if (this._editor) {
      const model = this._editor.getModel();
      this._disposables.push(
        model.onDidChangeContent(() => {
          const value = model.getValue();
          this._valueSignal.set(value);
          this.onChange(value);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
    if (this._disposables.length) {
      this._disposables.forEach((disposable) => disposable.dispose());
      this._disposables = [];
    }
  }
}
