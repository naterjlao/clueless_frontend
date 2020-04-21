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

  initTokens(){
    /* Code Backup
    var players = this.gameState.players;
    var places = this.gameState.game_board;
    var characters = JSON.parse(players);    
    var locations = JSON.parse(places);
    console.log(players);
    console.log(places);
    console.log(characters);
    console.log(locations);*/

    var places = this.gameState.game_board;
    var locations = JSON.parse(places);

    /* Map the suspect names in turn_list to an array */
    var characters = this.gameState.turn_list.map(character => character.suspect);
 
    /* Prints array outputs to log for verification */
    characters.forEach(suspect => console.log(suspect));
    locations.forEach(tile => console.log(tile));

    /* Loop through each location looking for a player character. */
    for (let i = 0; i < locations.length; i++){
      if ('null' != locations[i].suspects){
        var playPiece = document.getElementById(locations[i]); /* might actually be locations[i].name */
        playPiece.style.display = "block";
      }
    }


  }

  ngOnDestroy() { //prevent memory leak when component destroyed
    this.gameState_subscription.unsubscribe();
  }

}
