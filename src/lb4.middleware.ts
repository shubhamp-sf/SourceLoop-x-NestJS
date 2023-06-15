import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthenticationServiceApplication } from '@sourceloop/authentication-service/dist/application';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoopBackMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.url = req.originalUrl;
    // (global.authService as AuthenticationServiceApplication).restServer.httpHandler.handleRequest(req, res);
    (global.authService as AuthenticationServiceApplication).requestHandler(
      req,
      res,
    );
    // next();
  }
}
