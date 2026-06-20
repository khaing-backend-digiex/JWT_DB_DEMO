import { HttpStatus } from '../constant/enum';

export class AppException extends Error {
    constructor(
        public statusCode: HttpStatus,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
