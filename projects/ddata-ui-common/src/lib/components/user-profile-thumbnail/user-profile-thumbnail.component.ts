import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface ImageInterface {
  src: string;
}

interface UserInterface {
  name: string;
  image?: ImageInterface;
}

@Component({
  selector: 'dd-user-profile-thumbnail',
  templateUrl: './user-profile-thumbnail.component.html',
  styleUrls: ['./user-profile-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiUserThumbnailComponent {
  private internalUser: UserInterface = { name: 'X', image: null };

  firstLetter = 'X';
  imageSrc = '';

  @Input() set user(value: UserInterface) {
    let userValue = value;

    if (!userValue) {
      userValue = {
        name: 'X',
        image: null
      };
    }

    this.internalUser = userValue;
    this.firstLetter = (userValue.name ?? '').charAt(0).toUpperCase();
    this.imageSrc = !!userValue.image && !!userValue.image.src ? userValue.image.src : '';
  }

  get user(): UserInterface {
    return this.internalUser;
  }
}
