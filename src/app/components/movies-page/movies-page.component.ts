import { Component, OnInit } from '@angular/core';
import { Movie } from './models/Movie';
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap,
  map,
} from "rxjs/operators";
import { MoviesStore } from './store/movies.store';
import { Book } from './models/Book';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.css'],
  providers: [MoviesStore],
})
export class MoviesPageComponent implements OnInit {

  // TODO: FORMA 1 - CONSULTAR AL "STORE" SIN SELECTOR
  // readonly movies$ = this._moviesStore.state$.pipe(
  //   map(state => state.movies),
  // );
  // TODO: FORMA 2 - CONSULAR AL "STORE" CON SELECTOR
  movies$ = this._moviesStore.movies$;
  selectedMovieId$ = this._moviesStore.selectedMovieId$;
  userPreferredMoviesIds$ = this._moviesStore.userPreferredMoviesIds$; 
  book$ = this._moviesStore.book$; 
  userPreferredMovies$ = this._moviesStore.userPreferredMovies$; // TODO - LAS COMBINACION DE LOS SELECTORS

  // TODO GETTER
  book: Book = this._moviesStore.getBook();
 
  constructor(
    private readonly _moviesStore: MoviesStore
  ) {}
 
  ngOnInit() {
    this.resetMovies();
    this.addMovie({name: "Start wars", id: 99});
    this.updateSelectedMovie(99);
    this.addMoviePatch({name: "Transforms", id: this.generateUUID()});
    this.addMoviesPrefered([99]);

    this.updateBook({name: "libro de fuego", id: 874});
  }


  // TODO: HACIENDO USO DE MI REDUCER "addMovie" 
  add(nameMovie: string): void {
    this._moviesStore.addMovie({ name: nameMovie, id: this.generateUUID() });
  }

  updateBook(book: Book): void {
    this._moviesStore.addBook(book);
  }

  updateNameBook(name: string): void {
    this._moviesStore.updateNameBook(name);
  }

  // TODO: USO DEL "setState()" PARA SETEAR El STORE
  resetMovies(): void {
    this._moviesStore.setState({
      movies: [], 
      selectedMovieId: 0,
      userPreferredMoviesIds: [],
      book: null,
    });
  }
 
  // TODO: USO DEL "setState()" PARA INSERTAR UNA NUEVA "Movie" EN EL STORE
  addMovie(movie: Movie): void {
    this._moviesStore.setState((state) => {
      return {
        ...state,
        movies: [...state.movies, movie],
      };
    });
  }

  // TODO: USO DEL "patchState" para ACTUALIZAR EL STORE, NOTA: LA PROPIEDAD DEBE LLAMARSE IGUAL, CASO CONTRAI DARA UN ERROR DE SINTAXIS
  updateSelectedMovie(selectedMovieId: number): void {
    this._moviesStore.patchState({selectedMovieId});
  }
  
  // TODO: USO DEL "patchState" para INSERTAR UNA NUENA "Movie" EL STORE
  addMoviePatch(movie: Movie): void {
    this._moviesStore.patchState((state) => ({
      movies: [...state.movies, movie]
    }));
  }

  addMoviesPrefered(userPreferredMoviesIds: number[]): void{
    this._moviesStore.patchState({userPreferredMoviesIds});
  }

  // TODO: USO DE SELECTORES COMBINADOS, - MUESTRAME EL LOS DATOS COMPLETOS DE LA PELICULA SELECIONADA DE LA LISTA.
  getFullDataMovieCurrentSelected(): void {
    this.movies$.subscribe(x => {
      console.log(x);
    })

    this.userPreferredMovies$.subscribe(x => {
      console.log(x);
    });
  }

  viewQuantityMovies(): void {
    this.movies$.subscribe(x => {
      console.log(x.length);
    });
  }

  // * Implementacion a parte para generar mis IDs xd
  generateUUID(): any { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

}
