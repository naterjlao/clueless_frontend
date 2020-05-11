import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GameboardComponent } from './gameboard/gameboard.component';
import { ExitDialogComponent } from './exit-dialog/exit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StartMenuComponent,
    GameMenuComponent,
    PlayerSelectMenuComponent,
    GameboardComponent,
    ExitDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
