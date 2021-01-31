export class AlertDTO {
  status: number;
  responseHeader: string;
  message: string;
  btnLabels?: string[];
  btnUrls?: string[];
  duration?: number;
  type?: string;


  constructor(status: number, responseHeader: string, message: string,
              duration?: number, type?: string, btnLabels?: string[], btnUrls?: string[]) {
    this.status = status;
    this.responseHeader = responseHeader;
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.btnLabels = btnLabels;
    this.btnUrls = btnUrls;
  }
}
