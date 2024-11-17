import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../models/company';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.component.html',
  styleUrl: './location-card.component.css'
})
export class LocationCardComponent implements OnInit{

  @Input() lat : number=0 ;
  @Input() long: number= 0;
  @Input () Company!:Company;
  private accessToken = 'pk.eyJ1IjoiYWRoYW1rYW1hbDIyMzQ1IiwiYSI6ImNtMHVvNjM1dDBpenUyaXFzb21tM2JiOWkifQ.wXQZpp_tsqdoiqZAl9PbpQ'
  address: string = '';
  addressArr!:string[];
  private map!: mapboxgl.Map;
  private lang = localStorage.getItem('lang') || 'ar';
  constructor(private http: HttpClient){
  }
  ngOnInit():void{
    if (this.map) {
      console.log(this.map);
    }
    console.log(this.lat,this.long);
    this.getAddressFromCoordinates(this.long, this.lat);
  }
  getAddressFromCoordinates(lng: number, lat: number): void {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}&language=${this.lang}`;
    this.http.get(url).subscribe({
      next: (response:any) => {
        if (response.features && response.features.length > 0) {
          this.address = this.lang === 'en' ? response.features[0]?.place_name_en : response.features[0]?.place_name;
          console.log(lng,lat)
        console.log(this.address);
        this.divide(this.address );
      }
      },
      error:(error:any) => {
        console.error('Error fetching address:', error);
      },
      complete: () => {
        console.log('Request complete');
      }
    })
  }
  divide(address:string){
    this.addressArr= address.split(',')
    console.log( this.addressArr);
  }


}
