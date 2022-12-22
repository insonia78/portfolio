import React, { useEffect, useState } from 'react';
import { ApiPageLineChartComponent } from '../../components/ApiPageLineChartComponent';
import { KeysMessageComponent } from '../../components/KeysMessageComponent';
import { KeysTableComponent } from '../../components/KeysTableComponent';
import { SelectDisplayComponent } from '../../components/SelectDisplayComponent';
import { UsageTableComponent } from '../../components/UsageTableComponent';
import { getData, getDataForThisAndPreviousMonth } from './function';
import { DataForApiCallsGraphInterface, TotalApiCallsInterface } from './interface';
import styles from "./scss/styles.module.scss";



export const ApiAccessPage = () => {
  const [data, setData] = useState<TotalApiCallsInterface>();
  const [apiCallData, setApiCallData] = useState<DataForApiCallsGraphInterface>()
  const [selected, setSelected] = useState("statistics");


  useEffect(() => {

    if (data === undefined)
      setData(getData());
    else {
      console.log("welcome");
      const value: any = getDataForThisAndPreviousMonth("05", "02", "01", "2020", data.data)
      setApiCallData(value);
    }


  }, [data])

  return (
    <div>
      <SelectDisplayComponent setSelected={setSelected} selected={selected} />
      {(selected === 'statistics') && <main className={styles['main-page-container']}>
        <UsageTableComponent apiCallData={apiCallData} />
        <div className={styles['graph-container']}>
          <ApiPageLineChartComponent graphData={apiCallData?.graphData} />
        </div>
      </main>}

      {(selected === 'keys') &&
        <main className={styles['main-page-container-2']}>
          <KeysTableComponent apiCallData={apiCallData} setApiCallData={setApiCallData} setSelected={setSelected}/>
          <KeysMessageComponent />
        
        </main>}
       </div >  
        

    );


}