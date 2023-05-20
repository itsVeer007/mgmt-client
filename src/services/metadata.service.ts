import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  metadata = 'http://usstaging.ivisecurity.com:777/common/getValuesListByType_1_0';

  new = 'http://usstaging.ivisecurity.com:777/common/downloadFile_1_0?assetName=test19-May001&requestName=av_assets&levels=JTTEST001';

  // x = 'http://192.168.0.135:8080/getAssetFile_1_0?assetName=BS-AMR1G11A111-Test001.mp4&deviceId=IVISDUM0001DV1'

  constructor(private http: HttpClient) { }

  getMetadata() {
    return this.http.get(this.metadata);
  }



  downloadFile(id: any) {
    let getATestVideoURL = 'http://usstaging.ivisecurity.com:777/common/downloadFile_1_0?';

    let myObj = {
      'assetName': 'test19-May001',
      'requestName': 'av_assets',
      'levels': id,
    }

    return this.http.get(getATestVideoURL, { params: myObj });
  }

  dw() {
    return this.http.get(this.new);
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

  add(payload: any) {
    let url = this.metadata + '/addMetadataKeyValue_1_0'
    return this.http.post(url, payload);
  }
}
