import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import  IMarvel from './marvel/marvel.interface';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

    constructor(private http: HttpClient) {
    }

    private async request(method: string, url: string, data?: any) {
 

      const result = this.http.request(method, url, {
        body: data,
        responseType: 'json',
        observe: 'body',
        headers: {
     
        }
      });
      return new Promise((resolve, reject) => {
        result.subscribe(resolve, reject);
      });
    }

    getMovies() {
      return this.request('GET',`${environment.serverUrl}/movie`);
    }

    createMovie(movie) {
      return this.request('POST', `${environment.serverUrl}/movie`, movie);
    }

    updateMovie(movie) {
      return this.request('PUT', `${environment.serverUrl}/movie/${movie.id}`, movie);
    }

    deleteMovie(movie) {
      return this.request('DELETE',`${environment.serverUrl}/movie/${movie.id}`);
    }
    randomNumber(value){
      return this.request('GET', `${environment.serverUrl}/movie/random/${value}`);
    }
    GetMovieByID(value){
      return this.request('GET',`${environment.serverUrl}/movie/${value}`);
    }
    
}