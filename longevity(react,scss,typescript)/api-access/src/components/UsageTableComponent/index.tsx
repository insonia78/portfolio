import React, { useEffect, useState } from 'react';
import { DataForApiCallsGraphInterface, DataForApiCallsPerKeysGraphInterface } from '../../pages/ApiAccessPage/interface';
import { asteristcs, calculatePercentage, splitDecimals } from './function';
import styles from './scss/styles.module.scss';



export const UsageTableComponent = ({ apiCallData }: any) => {

    const _apiCallData: DataForApiCallsGraphInterface = apiCallData;
    const [ show , setShow ] = useState(true)

    return (
        <div className={styles["usage-table-container"]} >
            <div tabIndex={0} className={styles["header"]}>Usage</div>
            <div className={styles["usage-table-total-api-calls-outer-container"]} >
                <div className={styles["usage-table-total-api-calls-container"]} >
                    <div className={styles['usage-table-total-api-calls-container-column1']}></div>
                    <div tabIndex={0} className={styles['usage-table-total-api-calls-container-column2']}>Today</div>
                    <div tabIndex={0} className={styles['usage-table-total-api-calls-container-column3']}>Month</div>
                    <div tabIndex={0} className={styles['usage-table-total-api-calls-text']}>Total Api calls</div>
                    <div className={styles['usage-table-total-api-calls-today']}>
                        <div tabIndex={0}>{splitDecimals(_apiCallData?.sumOfCurrentDayApiCalls)}</div>
                        <div tabIndex={0} className={styles['sub-value']}>{`${calculatePercentage(_apiCallData?.sumOfCurrentDayApiCalls,_apiCallData?.sumOfPastDayMonthApiCalls)}%`}</div></div>
                    <div className={styles['usage-table-total-api-calls-month']}>
                        <div tabIndex={0}>{splitDecimals(_apiCallData?.sumOfCurrentMonthApiCalls)}</div>
                        <div tabIndex={0} className={styles['sub-value']}>{`${calculatePercentage(_apiCallData?.sumOfCurrentMonthApiCalls,_apiCallData?.sumOfPastMonthApiCalls)}%`}</div></div>
                    <div  tabIndex={0} className={styles['usage-table-estimate-cost-text']}>Estimate cost</div>
                    <div tabIndex={0} className={styles['usage-table-estimate-cost-today']}>{`$${splitDecimals(_apiCallData?.sumOfCurrentDayEstimatedCost)}`}</div>
                    <div tabIndex={0} className={styles['usage-table-estimate-cost-month']}>{`$${splitDecimals(_apiCallData?.sumOfCurrentMonthEstimatedCost)}`}</div>
                </div>
                <div className={styles["per-key-usage-table-container"]}>
                    <div tabIndex={0} className={styles['per-key-usage-table-container-column1']}>Per key usage</div>
                    <div  tabIndex={0} className={styles['per-key-usage-table-container-column2']}></div>
                    <div  tabIndex={0} className={styles['per-key-usage-table-container-column3']}></div>
                    {_apiCallData?.dataForApiCallsPerKeysGraphInterface.slice(0, show ? 2 : 5).map((e: DataForApiCallsPerKeysGraphInterface) =>
                        <>
                            <div className={styles['per-key-usage-table-input-outer-container']}>
                                <div className={styles['per-key-usage-table-input-container']}>
                                    <input  tabIndex={0} className={styles['per-key-usage-table-input']} value={asteristcs(e.key,5)} />
                                </div>
                            </div>
                            <div  tabIndex={0} className={styles['per-key-usage-table-today']}>{splitDecimals(e.todayCount)}</div>
                            <div tabIndex={0} className={styles['per-key-usage-table-month']}>{splitDecimals(e.month)}</div>
                        </>
                    )}
                    <div  tabIndex={0} onClick={()=> setShow(!show) } className={styles['per-key-usage-table-show-more-less-text']}>{ show ? "Show More":"Show Less" } </div>
                </div>
            </div>
        </div>


    );


}