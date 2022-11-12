import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptroService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return from(this.handleAccess(request, next));
  }
 
 private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // acesso ao token
  const securedEndpoints = ['http://localhost:8080/api/orders'];

  if(securedEndpoints.some(url => request.urlWithParams.includes(url))) {

  const accessToken = this.oktaAuth.getAccessToken();

  /// clonar o toke de acesso
  request = request.clone({
    setHeaders: {
        Authorization: 'Bearer ' + accessToken
    }
    });

   }

  return await lastValueFrom(next.handle(request));

  }
}
