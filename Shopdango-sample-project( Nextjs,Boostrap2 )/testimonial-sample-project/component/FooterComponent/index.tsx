import styles from './../../styles/Home.module.css'
// import Image from 'next/image'
export const FooterComponent: any = () => {


    return (
        <>
            <footer className={styles.footer}>
                <a
                    href="/"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                   
                        <span className={styles.logo}>
                            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
                            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                         
                        </span>
                    
                </a>
            </footer>
        </>
    );
}