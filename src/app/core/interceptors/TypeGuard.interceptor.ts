import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RESPONSE_ASSERT, ResponseAssert } from 'src/app/service/Backend/HttpContextToken';

@Injectable({ providedIn: 'root' })
export class ValidationInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler) {
    const assert: ResponseAssert<any> | null = req.context.get(RESPONSE_ASSERT);
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse && assert) {
          try {
            assert(event.body);
          } catch (err) {
            throw new Error(`Response validation failed for ${req.url}: ${(err as Error).message}`);
          }
        }

        return event;
      })
    );
  }
}
