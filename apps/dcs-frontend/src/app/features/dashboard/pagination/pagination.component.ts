import {Component, OnInit} from '@angular/core';

import {Store} from '@ngxs/store';

import {NextPageAction, PreviousPageAction} from '../../../core/redux/actions';
import {Observable} from 'rxjs';
import {PostState} from '../../../core/redux/states';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  firstPage: Observable<boolean>;
  lastPage: Observable<boolean>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.firstPage = this.store.select(PostState.firstPage);
    this.lastPage = this.store.select(PostState.lastPage);
  }

  nextPage() {
    this.store.dispatch(new NextPageAction());
  }

  previousPage() {
    this.store.dispatch(new PreviousPageAction());
  }

}