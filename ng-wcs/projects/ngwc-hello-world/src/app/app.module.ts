import { Injector, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
})
export class AppModule {
  private injector = inject(Injector);
  ngDoBootstrap() {
    const appComponent = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define('ngwc-hello-world', appComponent);
  }
}
