import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

//models
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Publication } from '../../models/publication';

// Services
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit {
  public title:string;
  public identity: User;
  public token: string;
  public status: string;
  public stats;
  public url:string;
  public publication: Publication;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService) {

      this.title = 'Side Bar';
      this.url = GLOBAL.url;
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.stats = this._userService.getStats();
      this.publication = new Publication(
        "",// _id: string,
        this.identity._id,// user: string,
        "",// text: string,
        "",// created_at: string,
        "",// file: string
      );
  }

  ngOnInit() {
    console.log('sidebar cargado');
  }

  onSubmit(form){
    console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        console.log({response:response});
        if(!response.publication){
          this.status = 'error';
          console.log('Error!!');
        } else {
          this.status = 'success';
          form.reset();
          //this._router.navigate(['/timeline']);
          this._router.navigate(['/timeline']);
          //this.publication = response.publication;
          //subir arcchivo
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log({errorMessage:errorMessage});
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  //Output
  @Output() sended = new EventEmitter();
  sendPublication(event){
    this.sended.emit({send:'true'});
    //console.log(event);

  }

}
