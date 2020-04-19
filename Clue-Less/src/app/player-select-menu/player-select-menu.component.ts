import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'player-select-menu',
  templateUrl: './player-select-menu.component.html',
  styleUrls: ['./player-select-menu.component.less']
})
export class PlayerSelectMenuComponent implements OnInit {

  testGameState; // ONLY USED FOR TESTING - TODO: remove later
  
  gameState; gameState_subscription;

  constructor(private serverSvc: ServerService) {
    this.gameState_subscription = this.serverSvc.gameState.subscribe({
      next: (gameState) => { this.gameState = gameState; }
    });
  }

  ngOnInit() {
    this.testGameState = this.serverSvc.getTestGameState(); // ONLY USED FOR TESTING - TODO: remove later
    console.log(this.testGameState);
    console.log(this.testGameState.players.length);
  }

  ngAfterViewInit() {
    this.serverSvc.createSocket();
  }

  ngOnDestroy() { //prevent memory leak when component destroyed
    this.gameState_subscription.unsubscribe();
  }

}
