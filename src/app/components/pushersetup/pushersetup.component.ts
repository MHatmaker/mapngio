import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PusherConfig } from '../../libs/PusherConfig';
import { PusherclientService } from '../../services/pusherclient.service';

@Component({
  selector: 'pushersetup',
  templateUrl: 'pushersetup.component.html'
})
export class PushersetupComponent {

  // userName: string;
  // privateChannelMashover : string;
  private pushergroup: FormGroup;

  constructor(
    public viewCtrl: ModalController, private formBuilder: FormBuilder,
    private pusherClientService: PusherclientService,
    private pusherConfig: PusherConfig) {
    console.log('Hello PushersetupComponent Component');
    // this.privateChannelMashover = 'Hello World';
    this.pushergroup = this.formBuilder.group({
      privateChannelMashover: [pusherConfig.getPusherChannel()], // , Validators.required],
      userName: [pusherConfig.getUserName()],
    });
  }

  accept() {
      this.viewCtrl.dismiss();
      const chnl = this.pushergroup.value.privateChannelMashover;  //  ['privateChannelMashover'];
      this.pusherConfig.setChannel(chnl); // this.pushergroup.value['privateChannelMashover']);
      const uname = this.pushergroup.value.userName;
      this.pusherConfig.setUserName(uname);
  }
  logForm() {
    console.log(this.pushergroup.value);
  }
  cancel() {
      this.viewCtrl.dismiss();
  }
}
