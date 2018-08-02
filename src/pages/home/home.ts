import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Rx';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, Marker, MarkerCluster, LatLng } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: GoogleMap;
  runner: Marker;
  zombies: Zombie[] = [];

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    this.loadMap();
    // setup Observable to regularly execute gameloop
    let sub = Observable.interval(1000).subscribe((val) => { this.gameloop(); })
    // sub.unsubscribe();
    // to stop it
  }

  loadMap() {
      let mapOptions: GoogleMapOptions = {
        camera: {
           target: {
             lat: 51.587432,
             lng: -0.319744
           },
           zoom: 18,
           tilt: 30
         }
      };
      this.map = GoogleMaps.create('map_canvas', mapOptions);

      this.runner = this.map.addMarkerSync({
        title: 'you',
        icon: { url: 'assets/art/runner.png'},
        animation: 'null',
        position: {
            lat: 51.587432,
            lng: -0.319744
        }
      });
      for (let i = 0; i < 10; i++) {
        this.zombies.push(new Zombie(51.588432-i*0.0001, -0.318744+i*0.0001, this.map));
      }
  }

  gameloop() {
    //for (let i = 0; i < this.zombies.length; i++)
      //this.zombies[i].stagger();
    this.zombies[0].stagger();
  }

  onButtonClick() {
      let position = this.runner.getPosition();
      console.log(position);
      position.lat = position.lat + 0.0001;
      position.lng = position.lng + 0.0001;
      this.runner.setPosition(position);
  }
}

class Zombie {
  position: LatLng;
  marker: Marker;
  //map: GoogleMap;

  constructor(lat:number, lng:number, map:GoogleMap) {
    this.position = new LatLng(lat, lng);
    //this.map = map;
    this.marker = map.addMarkerSync({
      title: 'zombie!',
      icon: { url: 'assets/art/zombie.png'},
      animation: 'BOUNCE',
      position: this.position
    });
  }

  stagger() {
    this.position.lng = this.position.lng + 0.0001;
    this.position.lat = this.position.lat + 0.0001;
    this.marker.setPosition(this.position);
    console.log("Zombie position: " + this.position);
  }
}
