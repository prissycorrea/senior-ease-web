import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-ajustes',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.scss',
})
export class Ajustes {
  private readonly _profileService = inject(ProfileService);

  get profile() {
    return this._profileService.profile;
  }
}
