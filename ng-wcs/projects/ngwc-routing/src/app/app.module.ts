import { Injector, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { SubpageComponent } from './subpage/subpage.component';
import { MainpageComponent } from './mainpage/mainpage.component';

@NgModule({
  declarations: [AppComponent, SubpageComponent, MainpageComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
})
export class AppModule {
  private injector = inject(Injector);
  ngDoBootstrap() {
    const appComponent = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define('ngwc-routing', appComponent);
  }
}
