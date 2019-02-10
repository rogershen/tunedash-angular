import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, generate } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { WindowService } from './window.service';
import { CookieService } from 'ngx-cookie-service';
import { Constants } from './constants';
import { Profile } from './profile';

const httpOptions = {
  headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private corsProxy: string = 'http://localhost:8080';
  private authorizationUrlPrefix: string = 'accounts.spotify.com/authorize?';
  private accessTokenUrl: string = 'accounts.spotify.com/api/token';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private windowService: WindowService,
    private cookieService: CookieService) {
  }

  generateQueryString(obj: any): string {
    let queryString: string = "";
    let iter: number = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (iter > 0) {
          queryString += '&';
        }
        queryString += `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
        iter += 1;
      }
    }
    return queryString;
  }

  generateRandomString(length: number): string {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  /** GET something from the server */
  authorize() {
    let state = this.generateRandomString(16);
    this.cookieService.set(Constants.STATE_KEY, state);

    let w = 400,
      h = 500,
      left = (screen.width / 2) - (w / 2),
      top = (screen.height / 2) - (h / 2);

    let window = this.windowService.getNativeWindow();
    window.open(`http://localhost:8080/authorize?state=${state}`,
      'Spotify Authorization',
      'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);

  }

  getTokens(code: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    return this.http.post<any>(`http://localhost:8080/callback?code=${code}`, httpOptions).pipe(
      tap((result: any) => this.log(`Result was ${result}`)),
      catchError(this.handleError<any>('getTokens'))
    );
  }

  getProfile(): Observable<Profile> {
    let uuid: string = this.cookieService.get(Constants.ACCESS_UUID);
    console.log(`http://localhost:8080/me?uuid=${uuid}`);
    return this.http.get<Profile>(`http://localhost:8080/me?uuid=${uuid}`)
      .pipe(
        tap(result => console.log(result)),
        tap(result => this.log(`fetched result ${result}`)),
        catchError(this.handleError<Profile>('me'))
      );
  }

  tracks(): Observable<any> {
    let uuid: string = this.cookieService.get(Constants.ACCESS_UUID);
    console.log(`http://localhost:8080/tracks?uuid=${uuid}`);
    return this.http.get<any[]>(`http://localhost:8080/tracks?uuid=${uuid}`)
      .pipe(
        tap(result => console.log(result)),
        tap(result => this.log(`fetched result ${result}`)),
        catchError(this.handleError('tracks', []))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a SpotifyService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SpotifyService: ${message}`);
  }
}
