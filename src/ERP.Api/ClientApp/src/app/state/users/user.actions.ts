import {createAction, props} from "@ngrx/store";



export const testUser = createAction('[login Page] USER TEST',props<{ email: string, password: string }>());

