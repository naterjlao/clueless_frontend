import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import * as PIXI from 'pixi.js';
import { element } from 'protractor';

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.less']
})
export class GameboardComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {

    //TODO: code for future use of pixi.js instead of canvas
    // let gameboardElement = document.getElementById('gameboard');
    // let gameboard = new PIXI.Application({resizeTo: gameboardElement, backgroundColor: 0xFFF000});
    // this.renderer.appendChild(document.getElementById("gameboard"), gameboard.view);
  }

  ngAfterViewInit() {
  }

}
