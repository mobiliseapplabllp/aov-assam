import { Component, OnInit } from '@angular/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent  implements OnInit {
  cameraActive = false;
  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() {
    // this.launchCamera();
  }

  ionViewDidLoad() {
    this.launchCamera();
  }

  launchCamera() {
    console.log(window.screen.width);
    console.log(window.screen.height);
    // const cameraPreviewOptions: CameraPreviewOptions = {
    //   position: 'front', // front or rear
    //   parent: 'content', // the id on the ion-content
    //   className: '',
    //   width: window.screen.width, //width of the camera display
    //   height: window.screen.height, //height of the camera
    //   toBack: true,
    // };
    CameraPreview.start({position: 'front', parent: 'content', className: '', width: window.screen.width, height: window.screen.height - 100, toBack: true}).catch(res => {
      alert(JSON.stringify(res));
    });
    this.cameraActive = true;
  }

  async takePicture() {
    // const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
    //   quality: 50,
    // };
    const result = await CameraPreview.capture({quality: 50});
    // this.image = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera(`data:image/jpeg;base64,${result.value}`, true);
  }

  async stopCamera(img: string, status: any) {
    this.closeModal(img, status);
  }

  async flipCamera() {
    await CameraPreview.flip();
  }

  async closeModal(data: any, status: any) {
    await CameraPreview.stop();
    this.modal.dismiss(data, status)
  }


}
