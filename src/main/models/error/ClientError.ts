import { Exception } from 'tsoa';
import { StatusCodes } from 'http-status-codes';

export default class ClientError extends Error implements Exception {
  constructor(public message: string, public status: number = StatusCodes.BAD_REQUEST) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}
