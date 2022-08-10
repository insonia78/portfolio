import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router';





export default function Footer() {

    const router = useRouter();
    const {
        query: { language },
    } = router

    return (
        <footer>

            <hr />

            <section>

                <p>&copy; 2021 FirstRx</p>

                <nav className="primary" aria-label="main navigation">
                    <ul>
                        <Link
                            href={{
                                pathname: '/src/components/Home',
                                query: { language: language,
                                         component:'prescription'  
                                        }
                            }}>
                            <li className="homelink cursor"><a className="selected">
                                {(language === 'english' || language === undefined) && <>Home</>}
                                {(language === 'spanish') && <>{'<Spanish>'}Home</>}
                            </a>
                            </li>
                        </Link>

                        <Link
                            href={{
                                pathname: '/src/components/Header/Help',
                                query: { language: language }
                            }}>
                            <li className='cursor'>
                                <a>
                                    {(language === 'english' || language === undefined) && <>Help</>}
                                    {(language === 'spanish') && <>{'<Spanish>'}Help</>}

                                </a>
                            </li>
                        </Link>
                        <Link
                            href={{
                                pathname: '/src/components/Header/AboutFirstRx',
                                query: { language: language }
                            }}><li className='cursor'><a>
                                {(language === 'english' || language === undefined) && <>About FirstRx</>}
                                {(language === 'spanish') && <>{'<Spanish>'}About FirstRx</>}



                            </a>
                            </li>
                        </Link>
                    </ul>
                </nav>

            </section>

        </footer>

    );


}