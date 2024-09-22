import { CardComponent } from 'components/CardComponent';
import React, { useEffect, useReducer, useState } from 'react';
import { fakeApiReducer, initialState } from 'reducers/fakeApiReducer';
import { getDataFromFakerApi } from './functions';
import { configurationData } from 'services/configurationFileService';
import { PaginationComponent } from 'components/global/PaginationComponent';




export const GridPage = () => {
   
   const [state, dispatch]: any = useReducer(fakeApiReducer,initialState)
   const [ pagination, setPagination ] = useState({
      paginationStart:0,
      paginationEnd:5
   })
   const { payload , loading } = state
   useEffect(() => {
      getDataFromFakerApi().
         then((_data: any) => dispatch({ type: 'first_call_to_fakeApi', payload:{data:_data}}))
   }, [])
                                           
      
   return (
      <div
       style={
         {
         display:"flex",
         flexDirection:"column",
         alignItems:"center",
         
       }}
      >
         <PaginationComponent data={payload} pagination={pagination} setPagination={setPagination}/>
         <CardComponent data={payload} pagination={pagination}/>
         <PaginationComponent data={payload} pagination={pagination} setPagination={setPagination} />   
      </div>
   );





}

