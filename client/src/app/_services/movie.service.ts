import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '@/_models';

@Injectable({ providedIn: 'root' })
export class MovieService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Movie[]>(`${config.apiUrl}/api/movies`);
    }

    create(movie: Movie) {
        return this.http.post(`${config.apiUrl}/api/movies`, movie);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/api/movies/${id}`);
    }
}