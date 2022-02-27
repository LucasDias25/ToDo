import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController, AlertController, ItemReorderEventDetail,} from '@ionic/angular';
import { UtilService } from '../services/util.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{

  //lista de tarefas
  tasks : any[] = [];

  constructor(
    private camera : Camera,
    private alertCtrl: AlertController, 
    private utilService: UtilService, 
    private actionSheetCtrl : ActionSheetController) { 
    let taskJson = localStorage.getItem('taskDb'); 

    if (taskJson != null) {
      this.tasks = JSON.parse(taskJson);
    }
  }


  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'O que deseja fazer?',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            this.add(form.newTask);
          }
        }
      ]
    });
    await alert.present();
  }

  //deletar todas as tarefas
  async deleteAll() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja excluir todas as tarefas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Sim',
          handler: (form) => {

            while (this.tasks.length != 0){
              this.tasks.pop();  
              this.updateLocalStorage();
            }

          }
        }
      ]
    });
    await alert.present();
  }


  async add(newTask: string) {
    //valida se o usario preencheu a task
    if (newTask.trim().length < 1) {
      this.utilService.showToast('Informe o que deseja fazer',1000);
      return;
    }

    let task = { name: newTask, done: false };

    this.tasks.push(task);
  
    this.updateLocalStorage();

  }



  updateLocalStorage(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }



  async openActions(task : any){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que deseja fazer?',
      buttons: [
        {
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;

            this.updateLocalStorage();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }



  async delete(task : any){

    const alert = await this.alertCtrl.create({
      cssClass: 'tertiary',
      header: 'Atenção!',
      message: '<strong>Tem certeza que deseja excluir?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelou');
          },
        },
        {
          text: 'Sim',
          handler: () => {
            this.tasks = this.tasks.filter(taskArray => task != taskArray);
            this.updateLocalStorage();
            console.log('Excluído');
          },
        },
      ],
    });

    await alert.present();
  }



  picture(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
     // Handle error
    });
  }

 
  ngOnInit() {
  }

}


