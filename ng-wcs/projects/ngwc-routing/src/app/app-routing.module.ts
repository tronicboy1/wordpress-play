import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubpageComponent } from './subpage/subpage.component';
import { MainpageComponent } from './mainpage/mainpage.component';

const routes: Routes = [
  { path: '', component: MainpageComponent },
  { path: 'subpage', component: SubpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
