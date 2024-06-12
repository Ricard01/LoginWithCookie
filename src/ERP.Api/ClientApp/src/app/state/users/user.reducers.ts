import {IUser} from "../../modules/users/models/user.model";
import {createReducer, on} from "@ngrx/store";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {UsersApiActions, UsersPageActions} from "./user.actions";


/*
  The Entity State is a predefined generic interface for a given entity collection with the following interface:

  interface EntityState<V> {
    ids: string[] | number[];
    entities: { [id: string | id: number]: V };
  }
  - ids: An array of all the primary ids in the collection
  - entities: A dictionary of entities in the collection indexed by the primary id

Extend this interface to provide any additional properties for the entity state.
 */

export interface IUserState extends EntityState<IUser> {
  selectedUserId: string | null;
  isLoading: boolean,
  error: string | null,
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState: IUserState = adapter.getInitialState({
  selectedUserId: null,
  isLoading: false,
  error: null,
});


export const userReducer = createReducer(
  initialState,
  on(UsersPageActions.opened, (state) => ({...state, isLoading: true})),
  on(UsersApiActions.loadedSuccess, (state, action) => {
    return adapter.setAll(action.users, {...state, isLoading: false});
  }),
  on(UsersApiActions.addedSuccess, (state, {user}) => {
    return adapter.addOne(user, state)
  }),
  on(UsersApiActions.loadFailed, (state, action) => {
    return {...state, isLoading: false, error: action.error};
  })
);

export const {selectAll, selectEntities} = adapter.getSelectors();
