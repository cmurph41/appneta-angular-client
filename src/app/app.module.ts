import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { PlayersService } from './players.service';
import { APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatSortModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, BrowserAnimationsModule, 
    MatTableModule, 
    MatSortModule, 
    MatInputModule
  ],
  providers: [PlayersService, 
    {
      provide: APP_INITIALIZER,
      useFactory: (ps: PlayersService) => function() { return ps.initPlayers()},
      deps: [PlayersService],
      multi:true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
