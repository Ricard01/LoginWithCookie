import {Component, OnInit} from '@angular/core';
import {IAppState} from "../../../state/app.state";
import {Store} from "@ngrx/store";
import {UserActions} from "../../../state/users";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.dispatch(UserActions.opened());
  }

}
