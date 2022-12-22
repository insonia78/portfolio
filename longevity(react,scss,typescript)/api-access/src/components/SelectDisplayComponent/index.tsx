import React, { useEffect, useState } from 'react';
import styles from './scss/styles.module.scss';
import logo from './../../assets/logo.png';
import jane from './../../assets/jane.png';
import { getName } from './function';

export const SelectDisplayComponent = ({setSelected,selected}:any) => {
   

    return (
        <div className={styles["patient-component-table-container"]}>
            <div className={styles["header"]}>Developer</div>
            <div className={styles["sub-header"]}>Api Access Tokens and Security Usage Details</div>
            <div className={styles["search-and-group-container"]}>
                <div className={styles["group-by-container"]}>
                    <div onClick= {() => { setSelected("statistics")}}
                        tabIndex={0}
                        className={`${styles["group-by-statistics"]} ${styles["group-by-container-buttons"]} ${selected === 'statistics' ?styles["selected"] : "" }`}>
                        Statistics
                    </div>
                    <div onClick= {() => { setSelected("models")}} 
                        tabIndex={0}
                        className={`${styles["group-by-models"]} ${styles["group-by-container-buttons"]} ${selected === 'models' ?styles["selected"] : "" }`}>
                        Models
                    </div>
                    <div
                        onClick= {() => { setSelected("keys")}} 
                        tabIndex={0}
                        className={`${styles["group-by-keys"]} ${styles["group-by-container-buttons"]} ${selected === 'keys' ?styles["selected"] : "" }`}>
                        Keys
                    </div>
                </div>
            </div>
        </div>


    );


}