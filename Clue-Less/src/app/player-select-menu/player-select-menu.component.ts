import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'player-select-menu',
  templateUrl: './player-select-menu.component.html',
  styleUrls: ['./player-select-menu.component.less']
})
export class PlayerSelectMenuComponent implements OnInit {

  constructor(private serverSvc: ServerService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.serverSvc.createSocket();
  }

}
