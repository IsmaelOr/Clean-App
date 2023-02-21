import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;   // Guardar la información del usuario que inicio sesión.
  isLoading: boolean = false;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public snackBar: MatSnackBar,
  ) { 
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.getRol(user.uid).then((rol) => {
          this.userData = {
            uid: user.uid,
            email: user.email,
            rol: rol
          };
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
        });
      }else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        this.userData = 'null';
      }
    })
  }

  async getRol(uid: string){
    var rol = '';
    var intentos = 0;
    while(rol == '' && intentos < 3 ){
      const userRef = this.afs.doc(`users/${uid}`);
      const userInfoCifrada = userRef.get();
      await userInfoCifrada.forEach((data:any) => {
        if(data.data()?.rol){
          rol = data.data().rol;
        }
      });
      intentos += 1;
    }
    return rol;
  }

  async SignIn(email: string, password: string){
    const infoUsuario: any = await this.afAuth.signInWithEmailAndPassword(email, password).then((usuarioFirebase) => {
      this.snackBar.open('LogIn successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      return usuarioFirebase;
    }).catch((error) => this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 }));
    
    if(infoUsuario.user.uid){
      this.router.navigate(["home"]);
    }
  }

  async SignUp(email: string, password: string, rol: string){
    const infoUsuario: any = await this.afAuth.createUserWithEmailAndPassword(email, password).then((usuarioFirebase) => {
      this.snackBar.open('User create successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      return usuarioFirebase;
    }).catch((error) => this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 }));

    if(infoUsuario.user.uid){
      const docRef = this.afs.doc(`users/${infoUsuario.user.uid}`);
      const userInfo = {
        email: email,
        rol: rol
      }
      docRef.set(userInfo);
      this.router.navigate(["home"]);
    }
  }

  async SignOut(){
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.snackBar.open('Sesión Cerrada', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 })
      this.router.navigate(["login"]);
    })
  }
  
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        //this.router.navigate(["sign-in"]);
        //this.SetUserData(result.user);
        this.snackBar.open('LogIn successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        return result;
      })
      .catch((error) => {
        this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
    }

  async GoogleAuth(rol: string) {
    this.isLoading = true;
    const infoUsuario : any = await this.AuthLogin(new auth.GoogleAuthProvider());
    this.isLoading = false;
    console.log(infoUsuario.user.uid);
    if(infoUsuario.user.uid){
      const userRef = this.afs.collection('users').doc(infoUsuario.user.uid);
      var UserExist = false;
      await userRef.get().forEach((data:any) => {
        if(data.data()){
          UserExist = true;
        }
      });
      if(!UserExist){
        const docRef = this.afs.doc(`users/${infoUsuario.user.uid}`);
        const userInfo = {
          email: infoUsuario.user.email,
          rol: rol
        }
        docRef.set(userInfo);
      }
      this.router.navigate(["home"]);
    }
  }




}

