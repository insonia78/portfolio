import React, { useState } from 'react';
import {
    getAllAlbums,
    getAllPhotos,
    getPhotos
} from './functions';


let ALBUMS;
let PHOTOS;

const fetchData = async (setAlbums, setAllPhotos) => {
    if (ALBUMS === undefined) {
        ALBUMS = await getAllAlbums();
        setAlbums(ALBUMS);
    }
    if (PHOTOS === undefined) {
        PHOTOS = await getAllPhotos();
        setAllPhotos(PHOTOS);
    }

    // a(ALBUMS);
    // b(PHOTOS);
}

export const Albums = () => {

    const [albums, setAlbums] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [clicked, setClicked] = useState([]);
    const [albumName, setAlbumName] = useState("");
    if (ALBUMS === undefined)
        fetchData(setAlbums, setAllPhotos);

    return (
        <>
            <div style={{ borderStyle:'groove',borderWidth:'10px',borderColor:"black"}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '95%',                    
                }}>
                    <h2 style={{marginLeft:'5vw'}}>Albums</h2>
                </div>
                <br />
                <br />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignContent:'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '35vh',
                    overflow: 'scroll',
                }}>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        width: '92%',
                        marginLeft: '4vw',
                      

                    }}>
                        {albums.map((element, i) => {

                            return <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: "18vw",
                                height: '30vh',
                                marginBottom: '1vh',
                                cursor: 'pointer',
                                marginRight: '2vw',
                                border: `${clicked[i] !== true ? '2px solid black' : '2px solid red'}`,
                                wordBreak: 'break-all'
                            }}
                                onClick={(e) => { setAlbumName(element.title); getPhotos(setPhotos, allPhotos, element.userId, i, ALBUMS, setClicked) }} >

                                <h4 style={{marginLeft:'1.5vw',marginRight:'1.5vw',textAlign:'center'}}>{element.title}</h4>
                            </div>
                        })}
                    </div>
                </div>
                <br />
                <br />
                <hr style={{ border: '4px solid black' }} />
                <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent:'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}>
                        <h2 style={{marginLeft:'3vh'}}>Photos {`${albumName ? `(${albumName})`:""}`}</h2>
                    </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                    height:'40vh',
                    overflow: 'scroll',
                    marginTop: '1vh',
                }}>
                   
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        width: '83%',
                       

                    }}>
                        {photos.map((element) =>
                            <div>
                                <img style={{
                                    width: "11vw",
                                    height: '18vh',
                                    border: '1px solid black',
                                    marginBottom: '1vh',
                                    marginRight: '1vw',
                                    marginLeft: '2vw'
                                }}
                                    src={element.thumbnailUrl}
                                />
                            </div>

                        )}
                    </div>
                </div>
            </div>

        </>
    )




}