import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  public loading: HTMLIonLoadingElement;

  constructor (
    private toastCtrl : ToastController,
    private loadingCtrl : LoadingController
    ) { }


  async showToast(message: string, duration: number = 1000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      //ccClass: 'aniamated bouceInRight',
      color: 'tertiary',
      position: 'middle'
    });
    toast.present();
  }



}