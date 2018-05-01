import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//modelos
import { Publication } from '../models/publication';
import { GLOBAL } from './global';


@Injectable()
export class PublicationService {

  public url:string;
  public identity:string;
  public token:string;
  public stats:string;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addPublication(token, publication): Observable<any> {
    let params = JSON.stringify(publication);
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.post(this.url+'publication', params, {headers: headers});
  }

  adeletePublication(token, publicationId): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.delete(this.url+'publication/'+publicationId,  {headers: headers});
  }

  getPublications(token, page = 1): Observable<any> {
    //let params = JSON.stringify(publication);
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.get(this.url+'publications/'+page, {headers: headers});
  }

  getPublicationUser(user, token, page = 1): Observable<any> {
    //let params = JSON.stringify(publication);
    let headers = new HttpHeaders()
      .set('content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.get(this.url+'publication-user/'+user+'/'+page, {headers: headers});
  }

}
