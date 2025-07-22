import { Component, OnInit, Input } from '@angular/core';

interface ImageInterface {
  src: string;
}

interface UserInterface {
  name: string;
  image?: ImageInterface;
}

@Component({
    selector: 'app-user-profile-thumbnail',
    templateUrl: './user-profile-thumbnail.component.html',
    styleUrls: ['./user-profile-thumbnail.component.scss'],
    standalone: false
})
export class DdataUiUserThumbnailComponent implements OnInit {
  private _user: UserInterface = { name: 'X', image: null };
  
  @Input() set user(value: UserInterface) {
    if (!value) {
      value = {
        name: 'X',
        image: null,
      };
    }

    this._user = value;
    this.firstLetter = value.name.split('')[0].toUpperCase();
    this.imageSrc = !!value.image && !!value.image.src ? value.image.src : '';
  }

  get user(): UserInterface {
    return this._user;
  }

  firstLetter = 'X';
  imageSrc = '';

  constructor() { }

  ngOnInit(): void {
  }

}
