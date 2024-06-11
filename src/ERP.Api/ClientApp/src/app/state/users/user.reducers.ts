import {IUser} from "../../modules/users/models/user.model";
import {createReducer, on} from "@ngrx/store";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {UserActions} from "./user.actions";


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
  // additional entity state properties
  selectedUserId: string | null;
  isLoading: boolean,

  error: string | null,

}
export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState: IUserState = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
  isLoading: false,
  error: null,
});

/* reducers executes after the dispatch
*  When an action is dispatched, all registered reducers receive the action.
*  Whether they handle the action is determined by the on functions that associate one or more actions with a given state change.
* */
export const userReducer = createReducer(
  initialState,
  on(UserActions.opened, (state) => ({...state, isLoading: true})), // What the store should do in response to the login action.
  on(UserActions.usersLoadedSuccess, (state, action) => {
    return adapter.setAll(action.users, {...state,  isLoading: false});
  }),


);

export const {selectAll, selectEntities} = adapter.getSelectors();
