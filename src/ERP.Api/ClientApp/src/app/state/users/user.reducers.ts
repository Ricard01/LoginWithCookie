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

/*
	•	'INIT': Estado inicial antes de que comience la carga.
	•	'LOADING': Estado mientras los datos están siendo cargados.
	•	'LOADED': Estado cuando los datos han sido cargados con éxito.
	•	{ errorMsg: string }: Estado cuando ocurre un error durante la carga, con un mensaje de error. */


export type LoadState = 'INIT' | 'LOADING' | 'LOADED' | { errorMsg: string };
const LOADING = 'LOADING' as const
const LOADED = 'LOADED' as const

export interface IUserState extends EntityState<IUser> {
  selectedUserId: string | null;
  loadState: LoadState;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState: IUserState = adapter.getInitialState({
  selectedUserId: null,
  loadState: 'INIT',
});


export const userReducer = createReducer(
  initialState,
  /*
  * Evito Recargas Innecesarias: Si el estado ya está en 'LOADED', significa que los datos ya están cargados y disponibles.
  * No tiene sentido cambiar a 'LOADING' nuevamente y posiblemente volver a cargar los datos, lo cual sería una operación innecesaria y podría impactar en el rendimiento.
  * Se complementa con el loadUsers Effect que esta está diseñado para cargar los usuarios solo si aún no han sido cargados previamente.
  * */
  on(UsersPageActions.opened, (state) => state.loadState === LOADED // Si el estado actual no es 'LOADED', cambia el estado a 'LOADING'.
    ? state
    : {...state, loadState: LOADING}
  ),
  on(UsersApiActions.loadedSuccess, (state, action) =>
    adapter.setAll(action.users, {...state, loadState: LOADED})
  ),
  on(UsersApiActions.addedSuccess, (state, {user}) =>
    adapter.addOne(user, state)
  ),
  on(UsersApiActions.loadFailed, (state, {error}) => (
    {...state, loadState: {errorMsg: error}}
  ))
);

export const {selectAll, selectEntities} = adapter.getSelectors();
