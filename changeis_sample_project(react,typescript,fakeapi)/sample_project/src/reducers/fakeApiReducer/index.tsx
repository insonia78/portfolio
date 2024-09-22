
export const initialState: any = {
    payload:[],
    loading:true
 };


export function fakeApiReducer(state:any, action:any) {
    
    switch (action.type) {
        case 'first_call_to_fakeApi': {            
          return {
            ...state,           
            loading:false,
            payload: action.payload.data};      
        }
        case 'refresh_call_to_fakeApi': {
          return {};
        }
      }
      throw Error('Unknown action: ' + action.type);
  }