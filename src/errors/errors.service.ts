import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorsService {
  handleError(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
