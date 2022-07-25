import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {CommonResponse} from "../common.response";

@Injectable()
export class ClassToPlainInterceptor<T> implements NestInterceptor<T, CommonResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<CommonResponse<T>>
    {
        return next.handle().pipe(map(data => new CommonResponse(HttpStatus.OK, data)));
    }
}