import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { UserService }  from './services/user.service';
import { GLOBAL }       from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title:string;
  public identity;
  public token:string;
  public url: string;

  constructor (
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService

  ){
    this.title = 'NGSOCIAL';
    this.url = GLOBAL.url;
  };

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);

  }
}
