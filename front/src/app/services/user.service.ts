import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//modelos
import { User } from '../models/user';
import { GLOBAL } from './global';



@Injectable()
export class UserService {
  public url:string;
  public identity:string;
  public token:string;
  public stats:string;


  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user : User): Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('content-Type', 'application/json');
    return this._http.post(this.url+'register', params, {headers: headers});
  }

  signUp(user, gettoken = null): Observable<any>{
    if(gettoken != null) user.gettoken = gettoken;

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('content-Type', 'application/json');
    return this._http.post(this.url+'login', params, {headers: headers});
  }

  updateUser(user:User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.put(this.url+'update-user/'+user._id, params, {headers: headers});

  }

  getCounters(userId = null): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', this.getToken());
    if(userId != null){
      return this._http.get(this.url+'counters/'+userId, {headers: headers});
    } else {
      return this._http.get(this.url+'counters', {headers: headers});
    }
  }

  getUsers(page = null): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.get(this.url+'users/'+page, {headers: headers});
  }

  getUser(userId): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.get(this.url+'user/'+userId, {headers: headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != "undefined"){
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return identity;
  }

  getToken(){
    let token = JSON.parse(localStorage.getItem('token'));
    if (token != "undefined"){
      this.token = token;
    } else {
      this.token = null;
    }
    return token;
  }

  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));
    if (stats != "undefined"){
      this.stats = stats;
    } else {
      this.stats = null;
    }
    return stats;
  }

}
