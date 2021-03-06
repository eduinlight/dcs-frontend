import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Subject, timer } from 'rxjs';
import { Store } from '@ngxs/store';

import {
  AuthState,
  Comment,
  CommentErrorAction,
  CommentState,
  CreateCommentAction,
  FetchCommentsAction,
  Post,
  UrlUtilsService,
  RoleEnum
} from '@dcs-libs/shared';
import { MomentService, ScrollService } from '../../../core/services';
import { LoginRequestModalComponent } from '../../components/login-request-modal';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss', '../post.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  unsubscribe = new Subject();

  @Input()
  post: Post = {} as Post;

  comments: Comment[] = [];
  commentError = '';

  isLogin = false;

  commentForm = new FormGroup({
    body: new FormControl('', Validators.required),
  });

  constructor(
    private store: Store,
    public moment: MomentService,
    private url: UrlUtilsService,
    private scroll: ScrollService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.store.select(CommentState.comments).subscribe(comments => {
      if (comments) {
        this.comments = comments;
      }
      timer(100).subscribe(() => {
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          this.scroll.scrollToFragment(fragment);
        }
      });
    });
    this.store.select(CommentState.error).subscribe(error => {
      this.commentError = error.message;
    });
    this.store.select(AuthState.isLogin).subscribe(isLogin => this.isLogin = isLogin);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  commentChangeEvent() {
    if (!this.isLogin) {
      this.postLikeClick();
      this.commentForm.controls.body.setValue('');
    }
  }

  postLikeClick() {
    this.dialog.open(LoginRequestModalComponent, {});
  }

  createComment() {
    if (this.commentForm.valid && this.checkEmptySpaces(this.commentForm.controls.body.value)) {
      const comment = {
        body: this.commentForm.controls.body.value,
        post: this.post.id
      } as Comment;
      this.store.dispatch(new CreateCommentAction(comment)).subscribe(() => {
        this.commentForm.reset();
        this.store.dispatch(new FetchCommentsAction(this.post.id));
        this.commentError = '';
      });
    } else {
      this.store.dispatch(new CommentErrorAction('Missing data in the comment'));
    }
  }

  getIsStaff(comment: Comment) {
    return comment.user ? comment.user.role.name === RoleEnum.staff : false;
  }

  getIsAdmin(comment: Comment) {
    return comment.user ? comment.user.role.name === RoleEnum.administrator : false;
  }

  getRole(comment: Comment) {
    return comment.user ? comment.user.role.name : '';
  }

  getUserAvatar(user) {
    return this.url.getUserImage(user);
  }

  getName(comment: Comment) {
    return comment.name || comment.user.username;
  }

  checkEmptySpaces(value: string): boolean {
    return value.replace(/ /gi, '') !== '';
  }
}
