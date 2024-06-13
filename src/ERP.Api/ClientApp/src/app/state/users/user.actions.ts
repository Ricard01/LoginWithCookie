import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {IUser} from "../../modules/users/models/user.model";

// createActionGroup es una práctica más moderna y alineada con las recomendaciones actuales de NgRx

export const UsersPageActions = createActionGroup({
  source: 'Users List Page',
  events: {
    'Opened': emptyProps(),
    'Create Button Clicked': emptyProps(),
    'Edit Button Clicked': emptyProps(),
    'Delete Button Clicked ': props<{ userId: string }>(),
  },
});

export const UsersApiActions = createActionGroup({
  source: 'Users API',
  events: {
    'Loaded Success': props<{ users: IUser[] }>(),
    'Load Failed': props<{ error: string }>(),
    'Added Success': props<{ user: IUser }>(),
    'Added Failed ': props<{ error: string }>(),
    'Update Success': props<{ user: IUser }>(),
    'Update Failed ': props<{ error: string }>(),
    'Delete Success': emptyProps(),
    'Delete Failed ': props<{ error: string }>(),
    'Error Occurred': props<{ error: string }>(),
  },
});

/* **Otra manera de definir acciones. La claridad y especificidad pueden ser más fáciles de manejar en proyectos de tamaño pequeño a mediano. **
export namespace UserActions {

  // export const openedUserList = createAction('[Users List Page] Opened');

  export const loadUserSuccess = createAction(
    "[Users API] Users Loaded Successfully",
    props<{ users: IUser[] }>()
  )

  export const usersLoadedFailure = createAction(
    "[Users API] Failed to Load Users",
    props<{ error: string }>()
  )

  export const userUpdate = createAction(
    '[User Page] Update User',
    props<{ user: IUser }>()
  )

// export const updateUserSuccess = createAction(
//   '[Users Api Update User Successfully',
//   props<{ update: Update<IUser> }>()
// )

  export const userUpdateFailure = createAction(
    '[Users Api] Update User Fail',
    props<{ error: string }>()
  )

  export const userAdded = createAction(
    '[User Page] Create User',
    props<{ user: IUser }>()
  )

  export const userAddedSuccess = createAction(
    '[Users Api Create User Successfully',
    props<{ user: IUser }>()
  )

  export const userAddedFailure = createAction(
    '[Users Api Create User Fail',
    props<{ error: string }>()
  )

  export const userDelete = createAction(
    '[User List] Delete User',
    props<{ id: string }>()
  )

  export const userDeleteSuccess = createAction('[Users Api Delete User Successfully')

  export const userDeleteFailure = createAction(
    '[Users Api Delete User Fail',
    props<{ error: string }>()
  )

  export const createClicked = createAction('[User List] Create Button Clicked')

  export const editClicked = createAction(
    '[User List] Edit Button Clicked',
    props<{ user: IUser }>()
  )

  export const deleteClicked = createAction(
    '[User List] Delete Button Clicked',
    props<{ user: IUser }>()
  )

}
*/
