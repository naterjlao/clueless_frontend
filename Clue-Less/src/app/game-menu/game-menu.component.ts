import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ServerService } from '../server-service/server.service';
import { ExitDialogComponent } from '../exit-dialog/exit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
   selector: 'game-menu',
   templateUrl: './game-menu.component.html',
   styleUrls: ['./game-menu.component.less']
})
export class GameMenuComponent implements OnInit, AfterViewChecked  {

   @ViewChild('scrollMe') private myScrollContainer: ElementRef;

   socket: any;

   gameHasBegun; gameHasBegun_subscription;
   playerId; playerId_subscription;
   availableCharacters; availableCharacters_subscription;
   playerstate; playerstate_subscription;
   gamestate; gamestate_subscription;
   checklist; checklist_subscription;
   moveOptions; moveOptions_subscription;
   suggestionOptions; suggestionOptions_subscription;
   cardList; cardList_subscription;
   message; message_subscription;

   characterNames = ['Colonel Mustard', 'Miss Scarlet', 'Professor Plum',
   'Mr Green', 'Mrs White', 'Mrs Peacock']; // all possible character names

   constructor(private serverSvc: ServerService, public dialog: MatDialog, private router: Router) {
      this.socket = this.serverSvc.getSocket();

      /* subscriptions to Subjects from the serverService */
      this.gameHasBegun_subscription = this.serverSvc.gameHasBegun.subscribe({
         next: (gameHasBegun) => this.gameHasBegun = gameHasBegun
      });
      this.playerId_subscription = this.serverSvc.playerIdChange.subscribe({
         next: (playerId) => this.playerId = playerId
      });
      this.availableCharacters_subscription = this.serverSvc.availableCharacters.subscribe({
         next: (availChars) => { this.availableCharacters = availChars; }
      });
      this.playerstate_subscription = this.serverSvc.playerstate.subscribe({
         next: (playerstate) => { this.playerstate = playerstate; }
      });
      this.gamestate_subscription = this.serverSvc.gamestate.subscribe({
         next: (gamestate) => { this.gamestate = gamestate; }
      });
      this.checklist_subscription = this.serverSvc.checklist.subscribe({
         next: (checklist) => { this.checklist = checklist; }
      });
      this.moveOptions_subscription = this.serverSvc.moveOptions.subscribe({
         next: (moveOptions) => { this.moveOptions = moveOptions; }
      });
      this.suggestionOptions_subscription = this.serverSvc.suggestionOptions.subscribe({
         next: (suggestionOptions) => { this.suggestionOptions = suggestionOptions; }
      });
      this.cardList_subscription = this.serverSvc.cardList.subscribe({
         next: (cardList) => { this.cardList = cardList; }
      });
      this.message_subscription = this.serverSvc.message.subscribe({
         next: (message) => { this.message = message; }
      });
   }

   ngOnInit() {
      this.scrollToBottom();
   }

   ngAfterViewInit() {
      this.serverSvc.enteredGame(); // notify server of client entering game-menu to trigger initialization communications
   }

   ngAfterViewChecked() {
      this.scrollToBottom();
   }

   beginGame() {
      this.serverSvc.startGame();
   }

   makeMove(room: string) {
      this.serverSvc.sendMoveChoice(room);
   }

   makeSuggestion() {
      this.serverSvc.sendSuggestionStart();
   }

   sendSuggestionChoice(suspect: string, weapon: string, room: string) {
      this.serverSvc.sendSuggestionChoice(
         {
            suspect: suspect,
            weapon: weapon,
            room: room
         }
      );
   }

   endTurn() {
      this.serverSvc.endTurn();
   }

   openExitDialog(): void {
      this.dialog.open(ExitDialogComponent, {
         maxWidth: "400px",
         data: { }
      });
   }

   getPlayerNum(playerId) {
      if(playerId === 'player0') {
         return 'Player 1';
      } else if(playerId === 'player1') {
         return 'Player 2';
      } else if(playerId === 'player2') {
         return 'Player 3';
      } else if(playerId === 'player3') {
         return 'Player 4';
      } else if(playerId === 'player4') {
         return 'Player 5';
      } else if(playerId === 'player5') {
         return 'Player 6';
      } else {
         // should never be more than 6 players, but this is reached if playerId is undefined
         return 'TIAAT';
      }
   }

   scrollToBottom(): void {
      try {
         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
   }

   disconnect() {
      this.serverSvc.removeSocket();
   }

   ngOnDestroy() { //prevent memory leak when component destroyed
      this.gameHasBegun_subscription.unsubscribe();
      this.playerId_subscription.unsubscribe();
      this.playerstate_subscription.unsubscribe();
      this.gamestate_subscription.unsubscribe();
      this.checklist_subscription.unsubscribe();
      this.moveOptions_subscription.unsubscribe();
      this.suggestionOptions_subscription.unsubscribe();
      this.cardList_subscription.unsubscribe();
      this.message_subscription.unsubscribe();
   }

}