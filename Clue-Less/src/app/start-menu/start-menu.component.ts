import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.less']
})
export class StartMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }

}
