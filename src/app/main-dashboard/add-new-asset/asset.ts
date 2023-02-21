export interface Asset {
  file: File | null,
  siteId: null | number;
  deviceId: null | number,
  enabled: null | number,
  mimetype: string,
  assetName: string,
  playOrder: null | number,
  startDate: string,
  endDate: string,
  createdBy: null | number,
  deviceMode: string,
  description: string
}
