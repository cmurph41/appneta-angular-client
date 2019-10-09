import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { PlayersService } from './players.service';
import { Subscription, Observable } from 'rxjs';
import { MatSort, MatTableDataSource } from '@angular/material';

export interface Player {
  name: string;
  nat: string;
  pos: string;
  height: number;
  weight: number;
  dob: Date;
  birthplace: string;
  id: number;
}
export interface Summary {
  nat: string;
  count: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  displayedColumns: string [] = ['name', 'nat', 'pos', 'height', 'weight', 'dob', 'birthplace', 'id'];
  dataSource = new MatTableDataSource ();

  @ViewChild( MatSort, { static: true } )
  sort: MatSort;

  title = 'client';
  private players: Player [] = [];
  $players: Observable<any>;
  playersSub: Subscription;
  private summaryPills: Summary [] = [];

  constructor ( private playersService: PlayersService ) {
  }

  ngOnInit() {
    this.setUpSub();
    this.dataSource.sort = this.sort;
  }

  public setUpSub () {
    this.$players = this.playersService.getCurrentPlayersEmitter ();
    this.playersSub = this.$players.subscribe( ( data: any ) => {
      for ( let [key, value] of data ) {
        this.players.push( value );
      }
      this.dataSource.data = this.players;
      this.dataSource.sort = this.sort;
      this.setSummary( this.dataSource.data as Player [] );
    });
  }

  ngAfterViewInit () {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy () {
    this.playersSub.unsubscribe;
  }

  applyFilter ( filterValue: string ) {
    this.dataSource.filter = filterValue.trim().toLowerCase ();
    this.setSummary( this.dataSource.filteredData as Player [] );
  }

  setSummary ( temp: Player [] ) {
    let summaryMap: any = new Map ();
    let summaryArray: Summary [] = [];

    for ( let value of temp ) {
      if ( summaryMap.has( value.nat ) ) {
        summaryMap.set( value.nat, summaryMap.get( value.nat ) + 1);
      } else {
        summaryMap.set( value.nat, 1 );
      }
    }
    for ( let [key, value] of summaryMap ) {
      summaryArray.push({ nat: key, count: value });
    }
    this.summaryPills = summaryArray;
  }
}
