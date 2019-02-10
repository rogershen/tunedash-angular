import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WindowService } from '../window.service';
import { MessageService } from '../message.service';
import { Constants } from '../constants';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private windowService: WindowService,
    private messageService: MessageService) { }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let access_uuid = params['access_uuid'] || null;
      this.messageService.add(`Received access_uuid: ${access_uuid}`);

      this.cookieService.set(Constants.ACCESS_UUID, access_uuid);
      let window = this.windowService.getNativeWindow();
      window.close();
    });
  }
}
