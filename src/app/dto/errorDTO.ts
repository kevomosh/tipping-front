export interface ErrorDTO {
  status: number;
  error: string;
  message: string;
  btnUrl?: string;
}

// export class ErrorDTO {
//   status: number;
//   error: string;
//   message: string;
//   btnLabel?: string[];
//   urls?: string[];
//   duration?: number;
//
//   constructor(status: number, error: string, message: string,
//               btnLabel?: string[], urls?: string[], duration?: number) {
//     this.status = status;
//     this.error = error;
//     this.message = message;
//     this.btnLabel = btnLabel;
//     this.urls = urls;
//     this.duration = duration;
//   }
// }

