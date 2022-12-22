import React, { useEffect, useState } from 'react';
import { DataForApiCallsGraphInterface, DataForApiCallsPerKeysGraphInterface } from '../../pages/ApiAccessPage/interface';
import { asteristcs } from '../UsageTableComponent/function';
import styles from './scss/styles.module.scss';
import copy from './../../assets/copy.png';
import sideArrow from './../../assets/doagonalArrow.png';
import eye from './../../assets/eye.png'
import plus from './../../assets/plus.png';
import { keyGenerator } from './function';
import { Link } from 'react-router-dom';


export const KeysTableComponent = ({ apiCallData, setApiCallData, setSelected }: any) => {

    const _apiCallData: DataForApiCallsGraphInterface = apiCallData;
    const [show, setShow] = useState(true)
    const [eyeShow, setEyeShow] = useState(_apiCallData?.dataForApiCallsPerKeysGraphInterface.map((e: any) => false))
    return (
        <div className={styles["keys-table-container"]} >
            <div tabIndex={0} className={styles["header"]}>Keys</div>

            <div className={styles["key-table-container"]}>
                {console.log("welcome", apiCallData.dataForApiCallsPerKeysGraphInterface)}
                <div tabIndex={0} className={styles['key-table-container-column1']}></div>
                <div className={styles['key-table-container-column2']}></div>
                <div className={styles['key-table-container-column3']}></div>

                {apiCallData?.dataForApiCallsPerKeysGraphInterface.slice().map((e: DataForApiCallsPerKeysGraphInterface, i: number) =>
                    <>
                        <div className={styles['key-table-input-outer-container']}>
                            <div className={styles['key-table-input-container']}>
                                <input tabIndex={0} className={styles['key-table-input']} value={eyeShow[i] ? e.key : asteristcs(e.key, 21)} />
                                <img onClick={() => { eyeShow[i] = !eyeShow[i]; setEyeShow(eyeShow.slice()) }} alt="" className={styles["key-table-eye"]} src={eye} />
                            </div>
                        </div>
                        <div className={styles['key-table-copy-image']}><img alt="" className={styles["copy-image"]} src={copy} /></div>
                        <div tabIndex={0} onClick={() => {

                            apiCallData.dataForApiCallsPerKeysGraphInterface.splice(i, 1);
                            setApiCallData( {...apiCallData});
                        }
                        } className={styles['key-table-container-revoke']}>Revoke</div>
                        <div tabIndex={0} className={styles['key-table-container-statistics']}> <span onClick={() => setSelected("statistics")}>Statistics<img alt="" className={styles["side-arrow-image"]} src={sideArrow} /></span></div>
                        <div className={styles['key-table-container-column3']}></div>
                    </>
                )}
                <div className={styles["per-key-new-button-outer-container"]}>
                    <div tabIndex={0} onClick={() => {
                        apiCallData.dataForApiCallsPerKeysGraphInterface.push(
                            {
                                key: keyGenerator(),
                                todayCount: "0",
                                month: "0"

                            });
                        setApiCallData({...apiCallData});
                    }
                    } className={styles['per-key-new-key-button']}>
                        <img alt="" className={styles["key-table-plus"]} src={plus} />New Key
                    </div>
                </div>
            </div>
        </div>
    );


}