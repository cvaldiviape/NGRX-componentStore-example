import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Movie } from "../models/Movie";
import { of, Observable } from "rxjs";
import { switchMap, tap, catchError } from "rxjs/operators";
import { Book } from "../models/Book";

export interface MoviesState {
  movies: Movie[];
  selectedMovieId: number | null;
  userPreferredMoviesIds: number[];
  book: Book;
}

export const initialState: MoviesState = {
  movies: [], 
  selectedMovieId: 987,
  userPreferredMoviesIds: [],
  book: {
    id: 47,
    name: "saksah xd"
  },
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  
  constructor() {
    super(initialState);
  }

  // TODO - crenado mi selector
  readonly movies$: Observable<Movie[]> = this.select(state => state.movies);
  readonly selectedMovieId$: Observable<number | null> = this.select(state => state.selectedMovieId);
  readonly userPreferredMoviesIds$: Observable<number[]>  = this.select(state => state.userPreferredMoviesIds);
  readonly book$: Observable<Book>  = this.select(state => state.book);
  // todod - creando mi selected combinando otros selectores, este selector selecionara la pelicula que tenga actualmente seleccionada en mi "selectedMovieId"
  readonly userPreferredMovies$ = this.select(
    this.movies$,
    this.userPreferredMoviesIds$,
    (movies, userPreferredMoviesIds) => movies.filter(movie => userPreferredMoviesIds.includes(movie.id))
);

  // TODO - crenado mi reducer, recibe como argumento el "state actual", y el "payload.state", para finalmente retornar un "nuevo state".
  readonly addMovie = this.updater((state: MoviesState, movie: Movie) => ({ // TODO: NOTA: cuando uso "updated()" me coondiciona a actualizar todo el "STATE".
    movies: [...state.movies, movie],
    selectedMovieId: state.selectedMovieId,
    userPreferredMoviesIds: [...state.userPreferredMoviesIds],
    book: state.book
  }))

  readonly addBook = this.updater((state: MoviesState, book: Book) => ({
    ...state,
    book: book,
   }))

  readonly updateNameBook = this.updater((state: MoviesState, nameBook: string) => ({
   ...state,
   book: {
    ...state.book,
    name: nameBook,
   }
  }))

  // TODO - puedo usar el metodo "get()" para consultar elementos del STORE sin necesidad de crear un "select", el cual me retorna 
  // TODO - un observable y necesita hacer subcribre para recien poder acceder al dato que deseo.
  getMovies(): Movie[]{
    return this.get().movies;
  }

  getBook(): Book{
    return this.get().book;
  }

}