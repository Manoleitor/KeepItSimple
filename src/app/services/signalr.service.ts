import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, JsonHubProtocol} from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public cursorPosition: any;
  public cursorPositionChange : Subject<any> = new Subject<any>();

  private _hubConnection: HubConnection;

  constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7097/chart')
      .build();
    this.cursorPositionChange.subscribe((value) => {
      // console.log(JSON.stringify(value));
      this.cursorPosition = value;
    });
  }

  public startConnection = () => {    
    this._hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addMessageListener() {
    this._hubConnection.on(
      'SendDM',
      (position: any) => {
        // console.log('DMS: SendDM received ' + JSON.stringify(position));
        this.cursorPositionChange.next(position);
        // this.cursorPosition = position;
      }
    );
  }

  public sendDirectMessage(pos: any): any {
    if (this._hubConnection) {    
      this._hubConnection.invoke('SendDirectMessage',pos);
    }else{
      console.error("sin conexion");
    }
  }
}
