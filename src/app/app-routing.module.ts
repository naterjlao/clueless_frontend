import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { PlayerSelectMenuComponent } from './player-select-menu/player-select-menu.component';
import { GameMenuComponent } from './game-menu/game-menu.component';

const routes: Routes = [
  { path: 'start', component: StartMenuComponent },
  { path: 'playerSelect', component: PlayerSelectMenuComponent },
  { path: 'game', component: GameMenuComponent },
  { path: '',   redirectTo: '/start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
