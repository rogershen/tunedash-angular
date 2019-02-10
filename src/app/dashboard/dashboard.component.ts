import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { MessageService } from '../message.service';
import { Profile } from '../profile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  profile: Profile;

  constructor(
    private spotifyService: SpotifyService,
    private messageService: MessageService) { }

  ngOnInit() {
  }

  authorize() {
    this.spotifyService.authorize();
  }

  getMessages() {
    console.log(this.messageService.messages);
  }

  getProfile() {
    this.spotifyService.getProfile().subscribe(profile => this.profile = profile);
  }

  getTracks() {
    this.spotifyService.tracks().subscribe();
  }
}
