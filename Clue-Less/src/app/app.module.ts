import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { PlayerSelectMenuComponent } from './player-select-menu/player-select-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameboardComponent } from './gameboard/gameboard.component';

@NgModule({
  declarations: [
    AppComponent,
    StartMenuComponent,
    GameMenuComponent,
    PlayerSelectMenuComponent,
    GameboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
