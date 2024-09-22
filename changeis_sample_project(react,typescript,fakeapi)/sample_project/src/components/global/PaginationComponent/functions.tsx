
export const createPagination = (setPagination: any, payload = [], pagination:any = {}, paginationGroups = 5) => {
    const groups: number = Math.round(payload.length / paginationGroups);
    const paginationArray = [];    
    
    for ( let i = 0; i < groups; i++ ) {
        
        paginationArray.push(      
        
        <h3
            key={`${i}groups`}
            style={
                {
                    borderTop: pagination['paginationEnd'] / groups === (i + 1) ? "2px solid black" : "" ,
                    cursor: "pointer",
                    marginRight: "0.3rem"
                }

            }
            onClick={() => {

                pagination = {
                    paginationStart: ((i - 1) < 0 ? 0 : i  ) * 5,
                    paginationEnd: (i + 1) * 5
                }
                
                setPagination(pagination)
            }}><a>{i + 1}</a></h3>);
    }
    
    return paginationArray;
}