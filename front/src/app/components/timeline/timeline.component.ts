import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

//models
import { User } from '../../models/user';
import { Publication } from '../../models/publication';

// Services
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, UploadService, PublicationService]
})
export class TimelineComponent implements OnInit {

  public title:string;
  //public user:User;
  public status: string;
  public page;
  public total;
  public pages;
  public message: string;
  public identity: User;
  public token: string;
  public url: string;
  //public fileToUpload: Array<File>;
  public publications: Publication[];
  public itemsPerPage;
  public more = true;
  public nextPage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService : UserService,
    private _uploadService : UploadService,
    private _publicationService:PublicationService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit() {
    this.getPublications(this.page);
  }

  getPublications(page, adding = false){
     this._publicationService.getPublications(this.token, page).subscribe(
       response => {
         console.log({responseGetP:response});
         if(!response.publications){
           this.status = 'error';
         } else {
           this.status = 'success';
           this.pages = response.pages;
           this.total = response.total_items;
           this.itemsPerPage = response.itemsPerPage;

           if(!adding){
             this.publications = response.publications;
           } else {
             this.publications = this.publications.concat(response.publications);
           }
           console.log({length:this.publications.length , total:this.total});
           if(this.publications.length == this.total){
             this.more = false;
           }
           this.nextPage = page +1;
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

  public refresh(event){
    console.log(event);
    this.getPublications(1);

  }

}
