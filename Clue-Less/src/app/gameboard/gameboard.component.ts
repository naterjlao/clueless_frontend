import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { element } from 'protractor';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.less']
})
export class GameboardComponent implements OnInit {

  gameState; gameState_subscription;

  constructor(private serverSvc: ServerService, private renderer: Renderer2, private el: ElementRef) {
    this.gameState_subscription = this.serverSvc.gameState.subscribe({
      next: (gameState) => { this.gameState = gameState; }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() { //prevent memory leak when component destroyed
    this.gameState_subscription.unsubscribe();
  }

}
