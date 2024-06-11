import {createAction, props} from "@ngrx/store";
import {IUser} from "../../modules/users/models/user.model";
export namespace UserActions {

export const opened = createAction('[Users List Page] Opened');

export const usersLoadedSuccess = createAction(
  "[Users Api] Users Loaded Successfully",
  props<{ users: IUser[] }>()
)

export const usersLoadedFailure = createAction(
  "[Users Api] Users Load Fail",
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
  '[Users Api Update User Fail',
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

export const userDeleteSuccess = createAction(  '[Users Api Delete User Successfully')

export const userDeleteFailure = createAction(
  '[Users Api Delete User Fail',
  props<{ error: string }>()
)

export const createClicked = createAction(  '[User List] Create Button Clicked')

export const editClicked = createAction(
  '[User List] Edit Button Clicked',
  props<{ user: IUser }>()
)

export const deleteClicked = createAction(
  '[User List] Delete Button Clicked',
  props<{ user: IUser }>()
)

}
