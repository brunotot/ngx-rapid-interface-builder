import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'ngx-painless-form';

const DEFAULT_LANGUAGE = 'plaintext';
const ASSETS_FOLDER_CONTEXT_PATH = 'assets/code/';

const language: { [key: string]: string } = {
  ts: 'typescript',
  js: 'javascript',
  html: 'html',
  scss: 'scss',
  css: 'css'
}

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.scss']
})
export class CodeSnippetComponent implements OnInit {
  @Input() code!: string;
  @Input() fileName: string = '';
  @Input() language: string = DEFAULT_LANGUAGE;
  ready: boolean = false;

  constructor(private http: HttpClient, private toast: ToastService) { 
  }

  ngOnInit(): void {
    if (this.fileName && !this.code) {
      this.setLanguageByFileName();
      this.http.get(`${ASSETS_FOLDER_CONTEXT_PATH}${this.fileName}`, { responseType: 'text' })
        .subscribe(fileText => {
          this.code = fileText.trim();
          this.ready = true;
        });
      return;
    }
    this.ready = true;
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  onCopyClick() {
    try {
      this.copyMessage(this.code);
      this.toast.showSuccess('', 'Successfully copied to clipboard')
    } catch (_) {
      this.toast.showError('', 'An error occurred while copying to clipboard')
    }
  }

  setLanguageByFileName() {
    let indexOfDot = this.fileName.indexOf('.');
    if (indexOfDot === -1) {
      this.language = DEFAULT_LANGUAGE;
      return;
    }
    let fileExtension = this.fileName.substring(indexOfDot + 1);
    this.language = fileExtension ? language[fileExtension] : DEFAULT_LANGUAGE;
  }
}
