import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.less']
})
export class GameboardComponent implements OnInit {

  gameboard; gameboard_subscription;

  constructor(private serverSvc: ServerService) {
    this.gameboard_subscription = this.serverSvc.gameboard.subscribe({
      next: (gameboard) => { this.gameboard = gameboard; }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() { //prevent memory leak when component destroyed
    this.gameboard_subscription.unsubscribe();
  }

}
