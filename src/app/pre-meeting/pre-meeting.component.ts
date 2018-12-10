import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.scss']
})
export class PreMeetingComponent implements AfterViewInit {
  @ViewChild('localVideo') localVideo: ElementRef;
  devicesReady: boolean;
  activePage: number;
  devices: any = {};
  audioInputSource: string;
  videoInputSource: string;
  audioOutputSource: string;
  stream: any;

  constructor() {
    this.activePage = 0;
  }

  getDevices() {
    return navigator.mediaDevices.enumerateDevices()
      .then((devicesList) => {
        this.devices = devicesList.reduce((acc, deviceInfo) => {
          switch (deviceInfo.kind) {
            case 'audioinput':
              acc.audioinput.push(deviceInfo);
              break;
            case 'audiooutput':
              acc.audiooutput.push(deviceInfo);
              break;
            case 'videoinput':
              acc.videoinput.push(deviceInfo);
              break;
          }

          return acc;
        }, {audioinput: [], audiooutput: [], videoinput: []});

        this.audioInputSource = this.devices.audioinput.length ? this.devices.audioinput[0].deviceId : null;
        this.videoInputSource = this.devices.videoinput.length ? this.devices.videoinput[0].deviceId : null;
        this.audioOutputSource = this.devices.audiooutput.length ? this.devices.audiooutput[0].deviceId : null;
      });
  }

  setSinkId() {
    if (typeof this.localVideo.nativeElement.sinkId === 'undefined') {
      console.log('Browser does not support output device selection.');
      return this.activePage = 3;
    }

    this.localVideo.nativeElement.setSinkId(this.audioOutputSource)
      .then(() => {
        this.activePage = 3;
      })
      .catch(err => {
        this.activePage = 3;
        console.error(err.message);
      });
  }

  mute() {
    this.stream.getAudioTracks()[0].enabled = !(this.stream.getAudioTracks()[0].enabled);
  }

  muteCamera() {
    this.stream.getVideoTracks()[0].enabled = !(this.stream.getVideoTracks()[0].enabled);
  }

  start() {
    if (this.stream) {
      this.stream.getTracks()
        .forEach(track => {
          track.stop();
        });
    }

    if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        audio: {deviceId: this.audioInputSource ? {exact: this.audioInputSource} : undefined},
        video: {deviceId: this.videoInputSource ? {exact: this.videoInputSource} : undefined}
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.stream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.devicesReady = true;
        })
        .catch((err) => {
          this.devicesReady = false;
          console.log('navigator.getUserMedia error: ', err);
        });
    }
  }

  initCamera() {
    this.activePage = 2;
    this.start();
    this.getDevices();
  }

  ngAfterViewInit() {
  }

}
