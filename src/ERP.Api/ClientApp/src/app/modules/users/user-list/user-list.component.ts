import {Component, OnInit, ViewChild} from '@angular/core';
import {IAppState} from "../../../state/app.state";
import {select, Store} from "@ngrx/store";
import {UsersPageActions} from "../../../state/users";
import {IUser} from "../models/user.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {map, Observable} from "rxjs";
import {selectAllUsers} from "../../../state/users/user.selectors";
import {MatSort} from "@angular/material/sort";
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { UserStateModule } from 'src/app/state/users/user.state.module';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SHARED_IMPORTS, UserStateModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent implements OnInit {

  constructor(private store: Store<IAppState>) {
    this.users$ = this.store.pipe(select(selectAllUsers));
  }

  columns = [
    {
      columnDef: 'id',
      header: 'Id',
      cell: (user: IUser) => user.id
    },
    {
      columnDef: 'userName',
      header: 'UserName',
      cell: (user: IUser) => user.userName,
    },
    {
      columnDef: 'name',
      header: 'Full Name ',
      cell: (user: IUser) => user.name,
    },
    {
      columnDef: 'userRoles',
      header: 'Role',
      cell: (user: IUser) => user.userRoles.map(role => role.roleName)
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      cell: () => ''
    }
  ]

  displayedColumns = this.columns.map(c => c.columnDef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<IUser>([]);
  users$: Observable<IUser[]>;


  ngOnInit(): void {
    this.init();
  }

  init() {
    this.store.dispatch(UsersPageActions.opened());

    this.users$.pipe(
      map(users => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        return this.dataSource;
      })
    ).subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
