import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import io from 'socket.io-client';
import * as PIXI from 'pixi.js';
import { element } from 'protractor';

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.less']
})
export class GameboardComponent implements OnInit {
  @ViewChild('game', {static: false}) private gameCanvas: ElementRef;

  private context: any;
  private socket: any;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.socket = io('http://brian.natelao.com:3000', { forceNew: false }); // TODO this is temporary
    this.socket.id = 'gameboard';

    //TODO: code for future use of pixi.js instead of canvas
    // let gameboardElement = document.getElementById('gameboard');
    // let gameboard = new PIXI.Application({resizeTo: gameboardElement, backgroundColor: 0xFFF000});
    // this.renderer.appendChild(document.getElementById("gameboard"), gameboard.view);
  }

  ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext('2d');

    this.socket.on('position', position => {
      this.context.clearRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x,position.y,10,10);
    });

  }

}
