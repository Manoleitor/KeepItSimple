import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from 'src/app/services/signalr.service';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';


@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  constructor(private _signalRService : SignalrService, private _HttpClient : HttpClient) { 
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'mousePos');
  }
  private curPos = {PosX : 0, PosY : 0};
  private el:HTMLDivElement;

  ngOnInit(): void {
    this._signalRService.startConnection();
    this._signalRService.addMessageListener();
    document.getElementsByName("background")[0].append(this.el);
    
    this._signalRService.cursorPositionChange.subscribe(value => {
      // console.log(JSON.stringify(value));
      const y = value.PosY + "px";
      const x = value.PosX + "px";
      // console.log(y);
      document.getElementsByName("mousePos")[0].style.top = y;
      document.getElementsByName("mousePos")[0].style.left = x;
    });
  }

  /**
   * mouseMove
mouse:any   */
  public mouseMove(mouse:any) {
    const currentPosition = this.getPosition(mouse);
    this.sendPosition(currentPosition);
  }

  /**
   * name
   */
  public getPosition(mouse: any) : any{
    return {PosX: mouse.clientX, PosY: mouse.clientY};
  }

  /**
   * sendPosition
    currentPosition: any   
*/
  public sendPosition(currentPosition: any) {  
    this._signalRService.sendDirectMessage(currentPosition);
  }


}
