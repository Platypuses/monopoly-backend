import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ErrorResponseDto from '../responses/ErrorResponseDto';
import ClientError from './ClientError';
import logger from '../../config/logger';

export default {
  handleError(
    error: unknown, req: Request, res: Response<ErrorResponseDto>, next: NextFunction,
  ): Response<ErrorResponseDto> | void {
    if (error instanceof ClientError) {
      logger.warn(`Client error: ${error.message} (${req.path})`);

      return this.buildErrorResponse(
        res, error.message,
        error.status, req.path,
      );
    }

    if (error instanceof Error) {
      logger.error(`Internal server error (${req.path}):`, error);

      return this.buildErrorResponse(
        res, ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR, req.path,
      );
    }

    return next();
  },

  buildErrorResponse(
    res: Response<ErrorResponseDto>, message: string, status: number, path: string,
  ): Response<ErrorResponseDto> {
    return res.status(status).json({
      message,
      status,
      timestamp: new Date(),
      path,
    });
  },
};
