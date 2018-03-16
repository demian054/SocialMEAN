import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

//models
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

// Component
import { SidebarComponent } from '../sidebar/sidebar.component';

// Services
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {
  public title:string;
  public user:User;
  public status: string;
  public message: string;
  public identity: User;
  public token: string;
  public url:string;
  public page;
  public next_page;
  public prev_page;
  public total;
  public pages;
  public users :User[];

  public follows;
  public followUserOver;



  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService) {

      this.title = 'Gente';
      this.url = GLOBAL.url;
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
   }

  ngOnInit() {
    console.log('cargado user component');
    console.log(this.identity);
    this.actualPage();
  }


  actualPage(){
    this._route.params.subscribe((params) => {
      let page = +params['page'];

      if (!page) page = 1;
      this.prev_page = page-1;
      if (this.prev_page <= 0) this.prev_page = 1;
      this.page = page;
      this.next_page = page+1;
      this.getUsers(page);
    });
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
      response => {
        console.log(response);
        if(!response.users) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.users_following;
          if(page > this.pages){
            this._router.navigate(['/gente']);
          }
        }

      },
      error => {
        var  errorMessage = <any>error;
        console.log(error);
        if (errorMessage != null){
          this.status = 'error';
        }
      });
  }


    followUser(followed){
      var follow = new Follow("", this.identity._id, followed);
      this._followService.addFollow(this.token, follow).subscribe(
        response => {
          console.log(response);
          if(!response.follow) {
            this.status = 'error';
          } else {
            this.status = 'success';
            this.follows.push(followed);
          }
        },
        error => {
          var  errorMessage = <any>error;
          console.log(error);
          if (errorMessage != null){
            this.status = 'error';
          }
        });
    }

    unfollowUser(followed){
      this._followService.deleteFollow(this.token, followed).subscribe(
        response => {
          console.log(response);
          var toDelete = this.follows.indexOf(followed);
          if(toDelete != -1){
            this.follows.splice(toDelete, 1);
          }
        },
        error => {
          var  errorMessage = <any>error;
          console.log(error);
          if (errorMessage != null){
            this.status = 'error';
          }
        });
    }

}
