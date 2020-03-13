import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Observable } from "rxjs"
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { User } from '@/_models';
import { AuthenticationService, MovieService } from '@/_services';
import { FormBuilder, Validators, AbstractControl} from '@angular/forms';

function CheckIfExistValidator(control: AbstractControl) {
    if (this.movies && this.movies.find(({title}) => title === control.value)) {        
        return { isExist: true };
    }
    return null;
}

function validateImageNotBroken(control: AbstractControl) {
    if (!control.value) return null;
    return new Observable((observer) => {
       function noimg(){
        observer.next({ isBroken: true })
        observer.complete();
       }
       function exist(){
        observer.next(null);
        observer.complete();
       }
       
       function loadIMG(url){
         var img=document.createElement('img');
         img.onload=exist;
         img.onerror=noimg;
         img.src=url
       }
       console.log('trying to load...')
       loadIMG(control.value);
    }) 
}

function validateLinkNotBroken(control: AbstractControl) {
    if (!control.value) return null;
    return /(http:|https:)\/\/www.imdb.com\/title\//.test(control.value) ? null : { isBroken: true };
}
@Component({ 
    templateUrl: 'home.component.html',
    styles: [
        `
        img {
            height: 128px;
        }
        .card {
            position: relative;
            margin-bottom: 20px;
        }
        .card a.text-danger {
            position: absolute;
            top: 5px;
            left: 5px;
        }
        .card-body div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        li.clickable{
            cursor: pointer;
        }
        `
    ]
})
export class HomeComponent implements OnInit {
    currentUser: User;
    movies = [];
    newMovie;
    availableCategories = ['animation', 'action', 'western', 'drama'];
    submitted = false;



    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private movieService: MovieService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        ) {
          this.newMovie = this.formBuilder.group({
            title: ['', [Validators.required, CheckIfExistValidator.bind(this)]],
            category: ['', Validators.required],
            link: ['', [Validators.required, validateLinkNotBroken]],
            posterUrl: ['', [Validators.required], validateImageNotBroken]
          });
        
          this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllMovies();
    }

    deleteMovie(id: number) {
        this.movieService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllMovies());
    }

    private loadAllMovies() {
       this.movieService.getAll()
            .pipe(first())
            .subscribe(movies => this.movies = movies);
    }

    get f() {
        return this.newMovie.controls; 
    }
    checkForm() {
      
        this.submitted = true;
        if (this.newMovie.invalid) {
            return false;
        }
        return true;
    }

    open(content) {
        this.newMovie.reset();
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.movieService.create(this.newMovie.value)
              .subscribe(() => this.loadAllMovies());
        }, () => {});
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    foundInMovies(availableCategories) {
        return availableCategories.filter(category => this.movies.map(({category}) => category).includes(category))
    }
}