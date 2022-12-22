import React, { useEffect, useState } from 'react';
import styles from './scss/styles.module.scss';
import logo from './../../assets/logo.png';
import jane from './../../assets/jane.png';
import { getName } from './function';

export const LogoAndNameWithImageComponent = () =>{
    
    const [name , setName ] = useState("");

    useEffect(()=>{

        setName(getName());

    },[])

    return (
       <>
       <div className={styles['header-container']}>
            <img tabIndex={0} alt={'logo'} className={styles.logo}  srcSet={logo} /> 
            <div className={styles['name-and-photo-container']}>
                <div tabIndex={0} className={styles["name"]}>{name}</div> 
                <img alt={jane} className={styles['name-image']} srcSet={jane} />
            </div> 
        </div>
       </>  
        

    );


}