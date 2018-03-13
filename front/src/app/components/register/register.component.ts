//modules
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//models
import { User } from '../../models/user';

// Services
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ UserService ]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public message: string;

  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService : UserService
  ) {
    this.title = 'Registro';
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
    this._userService.register(this.user).subscribe(
      response => {
        console.log(response);
        if(response.user && response.user._id){
          this.status = 'success';
          form.reset();
        } else {
          console.log('id no encontrado');
          this.status = 'error';
          this.message = response.message;
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

}
