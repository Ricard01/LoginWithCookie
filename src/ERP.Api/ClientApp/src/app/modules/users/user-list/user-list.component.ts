import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IAppState} from "../../../state/app.state";
import {select, Store} from "@ngrx/store";
import {UsersPageActions} from "../../../state/users";
import {IUser} from "../models/user.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {map, Observable} from "rxjs";
import {selectAllUsers} from "../../../state/users/user.selectors";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent implements OnInit, AfterViewInit {

  constructor(private store: Store<IAppState>) {
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


  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  users$: Observable<IUser[]> | undefined;


  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  init() {

    this.store.dispatch(UsersPageActions.opened());
    this.users$ = this.store.pipe(select(selectAllUsers));

    this.users$.subscribe(users => {
      this.dataSource.data = users;
    });

    // this.usersSource$ = this.store.pipe(
    //   select(selectAllUsers),
    //   map(users => {
    //     const dataSource = this.dataSource;
    //     dataSource.data = users;
    //     dataSource.paginator = this.paginator;
    //     return dataSource;
    //   }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
