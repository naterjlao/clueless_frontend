import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server-service/server.service';
import $ from 'jquery';

@Component({
  selector: 'player-select-menu',
  templateUrl: './player-select-menu.component.html',
  styleUrls: ['./player-select-menu.component.less']
})
export class PlayerSelectMenuComponent implements OnInit {

  availableCharacters; availableCharacters_subscription;

  characterIds = ['ColonelMustard', 'MissScarlet', 'ProfessorPlum',
    'MrGreen', 'MrsWhite', 'MrsPeacock']; // used to add styles to player buttons
  currentCharacterSelected; // holds the currently selected player
  characterSelected; // captures the player's final character selection

  constructor(private serverSvc: ServerService) {
    this.availableCharacters_subscription = this.serverSvc.availableCharacters.subscribe({
      next: (availChars) => { console.log(availChars); this.availableCharacters = availChars; }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.serverSvc.createSocket();
    this.serverSvc.enteredPlayerSelect(); // notify server of client entering player-select menu
  }

  // adds/removes stylings to show selected character
  clickCharacter(character: string) {
    this.characterIds.forEach( id => {
      //remove selectedClass
      $('#'+id).removeClass(id+'_onClick');
    });

    // add selected class
    $('#'+character).addClass(character+'_onClick');

    this.currentCharacterSelected = character;
  }

  // finalizes character selection and sends to server
  selectCharacter(character: string) {
    // add space into name to put in format that backend accepts
    let characterNameFormatted = character.replace(/([A-Z])/g, ' $1').trim()
    this.serverSvc.selectCharacter(characterNameFormatted);

    // mark final selection and remove other options from screen
    this.characterSelected = character;
    this.characterIds.forEach(id => {
      if (id !== character) {
        $('#'+id).addClass('removeButton');
      }
    });
  }

  // returns if the character is stil available
  characterIsAvailable(character: string) {
    return this.availableCharacters.includes(character);
  }

  disconnect() {
    this.serverSvc.removeSocket();
  }

  ngOnDestroy() { //prevent memory leak when component destroyed
    this.availableCharacters_subscription.unsubscribe();
  }

}
