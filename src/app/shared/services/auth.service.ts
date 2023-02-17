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

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public snackBar: MatSnackBar,
  ) { 
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      }else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        this.userData = 'null';
      }
    })
  }

  async SignIn(email: string, password: string){
    const infoUsuario = await this.afAuth.signInWithEmailAndPassword(email, password).then((usuarioFirebase) => {
      return usuarioFirebase;
    }).catch((error) => window.alert(error.message));
    
    console.log(infoUsuario);
  }

  async SignUp(email: string, password: string, rol: string){
    const infoUsuario: any = await this.afAuth.createUserWithEmailAndPassword(email, password).then((usuarioFirebase) => {
      return usuarioFirebase;
    }).catch((error) => this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 }));

    this.snackBar.open('User create successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

    console.log(infoUsuario.user.uid);
  
    const docRef = await this.afs.doc(`users/${infoUsuario.user.uid}`);
    const userInfo = {
      email: email,
      rol: rol
    }
    docRef.set(userInfo);
    this.router.navigate(["home"]);
  }

  async SignOut(){
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.snackBar.open('Sesión Cerrada', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 })
      this.router.navigate(["login"]);
    })
  }


}

