
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { Plugins } from '@capacitor/core';
import { CanvasService } from '../../services/canvas.service';

// const { Geolocation } = plugins;

@Component({
  selector: 'locateself',
  templateUrl: 'locateself.component.html',
  styleUrls: ['locateself.component.scss']
})
export class LocateselfComponent {
  private locateselfgroup: FormGroup;
  private latitude: number;
  private longitude: number;
  public findMe = true;
  public foundMe = false;
  constructor(
    public viewCtrl: ModalController,
    // private geoLocation: GeoLocation,
    private canvasService: CanvasService,
    private formBuilder: FormBuilder) {
    console.log('Hello LocateselfComponent Component');
    this.findMe = true;
    this.foundMe = false;
    this.locateselfgroup = this.formBuilder.group({
      latitude: ['initial latitude'], // , Validators.required],
      longitude: ['initial longitude'],
    });
  }
  async getCurrentLocation() {
    this.findMe = false;
    await this.canvasService.awaitCurrentLocation();
    this.foundMe = true;
    const chnl = this.locateselfgroup.value.latitude;
    const uname = this.locateselfgroup.value.longitude;
    const cntr = this.canvasService.getInitialLocation().center;
    this.locateselfgroup.setValue({latitude: cntr.lat, longitude: cntr.lng});
    // setTimeout(
    //   this.viewCtrl.dismiss(),
    //   3000);
  }
  accept() {
    const onClosedData = 'showme';
    this.viewCtrl.dismiss(onClosedData);
  }
  logForm() {
    console.log(this.locateselfgroup.value);
  }

  cancel() {
    const onClosedData = 'usequery';
    this.viewCtrl.dismiss(onClosedData);
  }
}
