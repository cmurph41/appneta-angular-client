import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
    headers: new HttpHeaders({
        'Accepts': 'application/json',
        'Content-type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PlayersService {
    private players: any = new Map ();
    public playersBehaviourSub: BehaviorSubject<any>;
    public $currentPlayersMap: Observable<any>;

    constructor(private httpClient: HttpClient) {
        this.playersBehaviourSub = new BehaviorSubject<any>( this.players );
        this.$currentPlayersMap = this.playersBehaviourSub.asObservable ();
        this.initPlayers ();
    }
    public initPlayers (): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            this.httpClient.get( 'http://localhost:4200/players', httpOptions )
                .toPromise ()
                .then( ( data: any ) => {
                    for ( let player of data ) {
                        this.players.set( player.id, player );
                    }
                    resolve();
                })
                .catch(
                    ( err: any ) => {
                        reject( err );
                    }
                )
        })
    }
    public getCurrentPlayersEmitter (): Observable<any> {
        return this.$currentPlayersMap;
    }
}