import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectMenuComponent } from './player-select-menu.component';

describe('PlayerSelectMenuComponent', () => {
  let component: PlayerSelectMenuComponent;
  let fixture: ComponentFixture<PlayerSelectMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerSelectMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
