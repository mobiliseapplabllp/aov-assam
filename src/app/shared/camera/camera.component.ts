import { Component, OnInit } from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
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
    this.launchCamera();
  }

  ionViewDidLoad() {}

  launchCamera() {
    CameraPreview.start({position: 'front', parent: 'content', className: '', width: window.screen.width, height: window.screen.height - 100, toBack: false}).catch(res => {
      alert(JSON.stringify(res));
    });
    this.cameraActive = true;
  }

  async takePicture() {
    const result = await CameraPreview.capture({quality: 50});
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
