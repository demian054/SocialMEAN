import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

//models
import { User } from '../../models/user';

// Services
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {

  public title:string;
  public user:User;
  public status: string;
  public message: string;
  public identity: User;
  public token: string;
  public url:string;
  public fileToUpload: Array<File>;

 constructor(
   private _route: ActivatedRoute,
   private _router: Router,
   private _userService : UserService,
   private _uploadService : UploadService
 ) {
   this.title = 'Actualizar mis Datos';
   this.user = this._userService.getIdentity();
   this.token = this._userService.getToken();
   this.identity = this.user;
   this.url = GLOBAL.url;
 }
  ngOnInit() {
    console.log('componente user-edit iniciado');
  }

  onSubmit(){
      console.log(this.user);
      this._userService.updateUser(this.user).subscribe(
        response => {
          console.log({response:response});
          if(!response.userUpdated){
            this.status = 'error';
          } else {
            this.status = 'success';
            localStorage.setItem('identity', JSON.stringify(response.userUpdated));
            this.identity = response.userUpdated;
            console.log({userUpdated:response.userUpdated});
            //subir archivo de imagen
            /*if(this.fileToUpload){
            this._uploadService.makeFileRequest(
                  this.url+'update-file-user/'+this.user._id, [],
                  this.fileToUpload,
                  this.token,
                  'image')
                  .then((result: any) => {
                    console.log({result:result});
                    this.user.image = result.user.image;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                  });
            }*/

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


  fileChangeEvent(fileInput: any){
    this.fileToUpload = <Array<File>>fileInput.target.files;
    console.log(this.fileToUpload);

    if(this.fileToUpload){
    this._uploadService.makeFileRequest(
          this.url+'update-file-user/'+this.user._id, [],
          this.fileToUpload,
          this.token,
          'image')
          .then((result: any) => {
            console.log({result:result});
            this.user.image = result.user.image;
            localStorage.setItem('identity', JSON.stringify(this.user));
          });
    }
  }



}
