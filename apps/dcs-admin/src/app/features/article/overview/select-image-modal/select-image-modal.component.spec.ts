import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngxs/store';

import { UrlUtilsService } from '@dcs-libs/shared';
import { SelectImageModalComponent } from './select-image-modal.component';

class StoreStub {
}

class MatDialogRefStub {
}

class UrlUtilsServiceStub {
}

describe('SelectImageModalComponent', () => {
  let component: SelectImageModalComponent;
  let fixture: ComponentFixture<SelectImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectImageModalComponent],
      providers: [
        {provide: Store, useClass: StoreStub},
        {provide: MatDialogRef, useClass: MatDialogRefStub},
        {provide: UrlUtilsService, useClass: UrlUtilsServiceStub}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectImageModalComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngOnInit').and.callFake(jest.fn());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
