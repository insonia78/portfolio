export const getAllAlbums = async () => {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/albums');
        return await response.json();

    }
    catch (e) {
        throw new Error(e);
    }

}
export const getAllPhotos = async () => {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/photos');
        return await response.json();

    }
    catch (e) {
        throw new Error(e);
    }

}
export const getPhotosWithUserId = async (userId) => {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${userId}/photos`);
        return await response.json();

    }
    catch (e) {
        throw new Error(e);
    }

}
const binarySearch = (value, list) => {
    let first = 0;    
    let last = list.length - 1;   
    let position = -1;
    let found = false;
    let middle;
    console.log('list',list);
    while (found === false && first <= last) {
        middle = Math.floor((first + last)/2);
        if (list[middle].albumId == value) {
            found = true;
            position = middle;
        } else if (list[middle].albumId > value) { 
            last = middle - 1;
        } else {  //in in upper half
            first = middle + 1;
        }
    }
    return position;
}
const findFirstIndex = (index,allPhotos,userId) =>{
              
             if(index === -1)
                 return index;
             let value = 0; 
             for(let i = index ; i >= 0; i-- )
             {
                
                 if(allPhotos[i].albumId !== userId)
                 {
                     value = ++i;
                     break;
                 }
                 else
                   value = i

             }
             return value;

}


/**************************************************** */
// 2 version for demonstration purpoises

/**************************************** */


/*
*  Done With parametirezed  
*/
const getPhotosWithPArameterCall =  async (setPhotos,userId,i,setClicked,ALBUMS) =>{
   
    setClicked(ALBUMS.map((e,index)=>{ if(index === i) return true; return false}));
    setPhotos( await getPhotos(userId));



}

/*
*  first done with binary search and all the data 
*/


export const getPhotos = (setPhotos,allPhotos, userId,i,ALBUMS,setClicked) =>{
       let index = binarySearch(userId,allPhotos);
       index = findFirstIndex(index,allPhotos,userId);
       const array = [];
       console.log('index',index,allPhotos,ALBUMS);
       for(let i = index; i < allPhotos.length && index !== -1;i++ )
       {
           if(allPhotos[i].albumId === userId)
              array.push(allPhotos[i]);
       }
       setClicked(ALBUMS.map((e,index)=>{ if(index === i) return true; return false}));
       setPhotos(array.slice());



}