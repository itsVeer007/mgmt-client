import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  metadata = 'http://usstaging.ivisecurity.com:777/common/getValuesListByType_1_0';

  constructor(private http: HttpClient) { }

  getMetadata() {
    let url = this.metadata;
    return this.http.get(this.metadata);
  }

  getDeviceMode() {
    let url = this.metadata;
    return this.http.get(url);
  }

  tempRange() {
    let url = this.metadata + 'Temp_Range'
    return this.http.get(url);
  }

  ageRange() {
    let url = this.metadata + 'Age_Range'
    return this.http.get(url);
  }

  productType() {
    let url = this.metadata + 'Product_Type'
    return this.http.get(url);
  }

  productModel() {
    let url = this.metadata + 'Product_Model'
    return this.http.get(url);
  }

  jobCategory() {
    let url = this.metadata + 'Job_Category'
    return this.http.get(url);
  }

  productCategory() {
    let url = this.metadata + 'Product_Category'
    return this.http.get(url);
  }

  weatherApi() {
    let url = this.metadata + 'Weather_API_Key'
    return this.http.get(url);
  }

}
