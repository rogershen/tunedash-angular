import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Constants {

  public static STATE_KEY = 'spotify_auth_state';
  public static ACCESS_UUID = 'spotify_access_uuid';

  constructor() { }
}
