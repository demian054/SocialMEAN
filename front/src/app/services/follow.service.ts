import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//modelos
import { User } from '../models/user';
import { GLOBAL } from './global';


@Injectable()
export class FollowService {

  public url:string;
  public identity:string;
  public token:string;
  public stats:string;


  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addFollow(token, follow): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.post(this.url+'follow', params, {headers: headers});
  }

  deleteFollow(token, userId): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.delete(this.url+'follow/'+userId,  {headers: headers});
  }



}
