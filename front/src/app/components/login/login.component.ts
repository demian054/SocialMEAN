import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//models
import { User } from '../../models/user';

// Services
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ UserService ]
})
export class LoginComponent implements OnInit {
   public title:string;
   public user:User;
   public status: string;
   public message: string;
   public identity: User;
   public token: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService : UserService
  ) {
    this.title = 'Login';
    this.user = new User(
      "", //_id: string,
      "", //name: string,
      "", //surname: string,
      "", //nick: string,
      "", //email: string,
      "", //password: string,
      "ROLE_USER", //role: string,
      "", //image: string
    );

  }

  ngOnInit() {
  }


  onSubmit(form){
    console.log(this.user);
    // logear al User
    this._userService.signUp(this.user).subscribe(
      response => {
        console.log(response);
        if(!response.user || !response.user._id){
          this.status = 'error';
          this.message = response.message;
        } else {
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this.getToken();

        }
      },
      error => {
        console.log(error);
        this.status = 'error';
        this.message = error.message;
      }
    );
  }

  getToken(){
    console.log(this.user);
    // logear al User
    this._userService.signUp(this.user, 'true').subscribe(
      response => {
        console.log(response);
        if(response.token){
          this.token = response.token;

          localStorage.setItem('token', JSON.stringify(this.token));
          this.getCounters();
        } else {
          console.log('token no encontrado');
          this.status = 'error';
          this.message = response.message;
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
        this.message = error.message;
      }
    );
  };

  getCounters(){
    this._userService.getCounters().subscribe(
      response => {
        console.log(response);
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        this._router.navigate(['/']);

      },
      error => {
        console.log(error);
        this.status = 'error';
        this.message = error.message;
      }
    )
  };

}
