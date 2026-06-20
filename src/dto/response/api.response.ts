
export class ApiResponse<T> {
  message: string;
  data: any;
  statusCode: number;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

}