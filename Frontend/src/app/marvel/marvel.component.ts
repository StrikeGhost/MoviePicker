import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ServerService } from '../server.service';
import IMarvel from './marvel.interface';
import Counted from './Count'
@Component({
  selector: 'app-marvel',
  templateUrl: './marvel.component.html',
  styleUrls: ['./marvel.component.css']
})
export class MarvelComponent implements OnInit {

  form: FormGroup;
  modalRef: BsModalRef;
  public counter: Counted[] = [];
  public movies: IMarvel[] = [];
  public marvel: IMarvel[] = [];
  currentMovie: any = { id: null, name: '', studio: '', year: '', duration: '', date: new Date() };
  idCounted: any = { idCount: null };
  modalCallback: () => void;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private server: ServerService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.currentMovie.name, Validators.required],
      studio: [this.currentMovie.studio, Validators.required],
      year: this.currentMovie.year,
      duration: this.currentMovie.duration,
      date: [this.currentMovie.date, Validators.required]
    });

    this.getMovies();
  }
//Update Info
  private updateForm() {
    this.form.setValue({
      name: this.currentMovie.name,
      studio: this.currentMovie.studio,
      year: this.currentMovie.year,
      duration: this.currentMovie.duration,
      date: new Date(this.currentMovie.date)
    });
  }
  //Get Count from the id that match the random number value
  getCount(value) {
    this.server.randomNumber(value).then
  }
  //get the movie details
  private getMovies() {

    this.server.getMovies().then((response: any) => {
      console.log('Response', response);
      this.movies = response.map((ev) => {
        ev.body = ev.studio;
        ev.header = ev.year;
        ev.icon = 'fa-clock-o';
        return ev;
      });
    });
  }
  //add a new film
  addMovie(template) {
    this.currentMovie = { id: null, name: '', studio: '', year: '', duration: '', date: new Date() };
    this.updateForm();
    this.modalCallback = this.createMovie.bind(this);
    this.modalRef = this.modalService.show(template);
  }

  createMovie() {
    const newMovie = {
      name: this.form.get('name').value,
      year: this.form.get('year').value,
      studio: this.form.get('studio').value,
      duration: this.form.get('duration').value,
      date: this.form.get('date').value
    };
    this.modalRef.hide();
    this.server.createMovie(newMovie).then(() => {
      this.getMovies();
    });
  }
//edit and update the movies
  editMovie(index, template) {
    this.currentMovie = this.movies[index];
    this.updateForm();
    this.modalCallback = this.updateMovie.bind(this);
    this.modalRef = this.modalService.show(template);
  }

  updateMovie() {
    const movieData = {
      id: this.currentMovie.id,
      name: this.form.get('name').value,
      year: this.form.get('year').value,
      studio: this.form.get('studio').value,
      duration: this.form.get('duration').value,
      date: this.form.get('date').value,
    };
    this.modalRef.hide();
    this.server.updateMovie(movieData).then(() => {
      this.getMovies();
    });
  }
//delete
  deleteMovie(index) {
    this.server.deleteMovie(this.movies[index]).then(() => {
      this.getMovies();
    });
  }
//cancel
  onCancel() {
    this.modalRef.hide();
  }
  //random number feature
  randomNumber(): number {
    var number = Math.floor(Math.random() * 1000) + 1;

    return number;

  }
  //picker to check if the number value matches with a id in the table if not it reruns it self until it does
  picker() {
    var value = this.randomNumber();
    var valueB = value;
    var result = this.server.randomNumber(value).then((response: any) => {
      console.log('Response', response);
      this.counter = response.map((ev) => {
        ev.body = ev.idCount;
        ev.icon = 'fa-clock-o';
        if (ev.body == 0) {
          console.log("NO MATCH");
          this.picker();

        }
        else {
          console.log("MATCH");

        }
        return ev;

      });
    }
    )
    console.log("THE NUMBER IS " + value);
    this.GetMovieByID(value);
  }
  //get a single movie by id
  GetMovieByID(value){
    this.server.GetMovieByID(value).then((response: any) => {
      console.log('Response', response);
      this.marvel = response.map((ev) => {
        ev.body = ev.name;
        ev.header = ev.year;
        ev.icon = 'fa-clock-o';
        return ev;
      });
    });

  }
}
