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
    // NFC merges a decomposed accent into its letter and Array.from splits by code point,
    // so neither an accented letter nor an emoji is cut in half
    const [firstCharacter = ''] = Array.from((userValue.name ?? '').normalize('NFC'));

    this.firstLetter = firstCharacter.toUpperCase();
    this.imageSrc = !!userValue.image && !!userValue.image.src ? userValue.image.src : '';
  }

  get user(): UserInterface {
    return this.internalUser;
  }
}
