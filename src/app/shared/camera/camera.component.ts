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
  base64Img!: string
  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.launchCamera();
  }

  ionViewDidLoad() {}

  launchCamera() {
    CameraPreview.start({position: 'rear', parent: 'content', className: '', width: window.screen.width, height: window.screen.height-150, toBack: false,}).catch(res => {
      alert(JSON.stringify(res));
    });
    this.cameraActive = true;
  }

  async takePicture() {
    const result = await CameraPreview.capture({quality: 50});
    // this.stopCamera(`data:image/jpeg;base64,${result.value}`, true);
    // this.base64Img = `data:image/jpeg;base64,${result.value}`;
    // this.convertImage(`data:image/jpeg;base64,${result.value}`,  'image/jpeg');
    const base64Response = await fetch(`data:image/jpeg;base64,${result.value}`);
    const blob = await base64Response.blob();
    console.log(blob);
    this.stopCamera(blob, true);
  }

  async stopCamera(img: any, status: any) {
    this.closeModal(img, status);
  }

  async flipCamera() {
    await CameraPreview.flip();
  }

  async closeModal(data: any, status: any) {
    await CameraPreview.stop();
    this.modal.dismiss(data, status)
  }

  b64toBlob(b64Data: string, contentType = '', sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  convertImage(base64Data: string, contentType: string): void {
    const blob = this.b64toBlob(this.btoaUTF8(base64Data), contentType);
    console.log(blob);
    this.stopCamera(blob, true);

  }

  btoaUTF8(unicodeString: string): string {
    return btoa(decodeURIComponent(encodeURIComponent(unicodeString)));
  }

}
