import React, { useEffect, useState } from 'react';
import styles from './scss/styles.module.scss';

export const KeysMessageComponent = () => {


    return (
        <div className={styles["keys-message-container"]} >
            <div tabIndex={0} className={styles["header1"]}>Keep keys private</div>
            <div tabIndex={0} className={styles["header2"]}>Keep keys safe</div>
            <div tabIndex={0} className={styles["mesage1"]}>Follow recommendations to keep keys safe</div>
            <div tabIndex={0} className={styles["mesage2"]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>


        </div>
    );


}