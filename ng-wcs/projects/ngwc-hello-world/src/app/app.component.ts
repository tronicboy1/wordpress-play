import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input() name = 'User';

  @HostListener('click')
  handleClick() {
    console.log('click')
  }
}
