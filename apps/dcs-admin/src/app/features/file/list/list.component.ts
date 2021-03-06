import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngxs/store';

import {
  ChangeFilesPageAction, ConfigState,
  FetchFilesAction,
  File,
  FileState,
  NextFilesPageAction,
  PreviousFilesPageAction, SetConfigAction,
  UrlUtilsService
} from '@dcs-libs/shared';
import { UploadFileModalComponent } from '../../components/upload-file.modal';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  files: File[] = [];

  numberOfPages = 0;
  currentPage = 0;

  tableOrCard = false;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private url: UrlUtilsService
  ) {
  }

  ngOnInit() {
    this.store.select(FileState.files).subscribe((files: File[]) => this.files = files);
    this.refreshPage();
    this.store.select(FileState.pageIndicators).subscribe(indicators => {
      if (indicators) {
        this.currentPage = indicators.page;
        this.numberOfPages = Math.ceil(indicators.count / indicators.pageSize);
      }
    });
    this.store.select(ConfigState.getConfigItem('dashboard-file-tableOrCard')).subscribe(value => this.tableOrCard = !!value);
  }

  openUploadFileModal() {
    const dialog = this.dialog.open(UploadFileModalComponent, {
      height: 'auto',
      width: '50vh',
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.refreshPage();
      }
    });
  }

  refreshPage() {
    this.store.dispatch(new FetchFilesAction()).subscribe(() => {
    });
  }

  normalizeUrl(url: string) {
    return this.url.normalizeImageUrl(url);
  }

  nextPageEvent() {
    this.store.dispatch(new NextFilesPageAction());
  }

  previousPageEvent() {
    this.store.dispatch(new PreviousFilesPageAction());
  }

  selectPageEvent(page) {
    this.store.dispatch(new ChangeFilesPageAction(page));
  }

  toggleTableCard() {
    this.tableOrCard = !this.tableOrCard;
    this.store.dispatch(new SetConfigAction('dashboard-file-tableOrCard', this.tableOrCard));
  }
}
