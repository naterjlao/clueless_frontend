import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit {

  @ViewChild('game', {static: false}) private gameCanvas: ElementRef;

  private context: any;
  private socket: any;

  playerId; playerId_subscription;
  whosTurn; whosTurn_subscription

  showGameBoard = false; //temp variable for dev use

  constructor(private serverSvc: ServerService) {
      this.playerId_subscription = this.serverSvc.playerId.subscribe({
        next: (playerId) => this.playerId = playerId
      });
      this.whosTurn_subscription = this.serverSvc.whosTurn.subscribe({
        next: (turn) => this.whosTurn = turn
      });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.context = this.gameCanvas.nativeElement.getContext('2d');
      this.socket = this.serverSvc.getInitialSocket(this.gameCanvas, this.context);
    }

    move(direction: string) {
      this.serverSvc.move(this.socket, direction);
    }

    endTurn() {
      this.serverSvc.endTurn(this.socket);
    }

    ngOnDestroy() { //prevent memory leak when component destroyed
      this.playerId_subscription.unsubscribe();
      this.whosTurn_subscription.unsubscribe();

      this.serverSvc.removeSocket(this.socket);
  }

}
