const sortEmployees:any = 
(event:any,setDefaultSortValue:Function,setSortValue:Function,
    setSortBy:Function,sortEmploeesBy:Function,
    searchInputValue:string,defaultToValue:string,
    defaultFromValue:string,sortValue:string) => {
    if (event.target.value === sortValue)
        return;
    setDefaultSortValue(event.target.value);
    setSortValue(event.target.value);
    setSortBy(event.target.value);
    sortEmploeesBy({
        variables: {
            name: searchInputValue,
            sort: event.target.value,
            to: (defaultToValue === 'pick_age' ? '' : defaultToValue),
            from: (defaultFromValue === 'pick_age' ? '' : defaultFromValue)
        }
    });

}
const resetSelect:any = ( setDefaultToValue:Function, setDefaultFromValue:Function) => {
    setDefaultToValue('pick_age');
    setDefaultFromValue('pick_age');

}
const resetComponents:any = 
(setDefaultToValue:Function, setDefaultFromValue:Function,setDefaultSortValue:Function) => {
    resetSelect(setDefaultToValue, setDefaultFromValue);
    setDefaultSortValue('choose_sort');
}

const setToAge:any = (sortToValue,setDefaultToValue:Function) => {

    if (isNaN(sortToValue)) {
        alert('is not a value');
        return;
    }
    setDefaultToValue(sortToValue);
    
}
const setFromAge:any = 
(setDefaultFromValue:Function,
    setAgeFilter:Function,_filterEmployeeByAge:Function,searchInputValue:Function,
    fromValue:string,defaultToValue:string,defaultFromValue:string,sortValue:string) => {
    
    if (isNaN(parseInt(fromValue))) {
        return;
    }
    
    if (isNaN(parseInt(defaultToValue))) {
        alert("please select To");
        return;
    }
    setDefaultFromValue(fromValue);
    if (parseInt(fromValue) < parseInt(defaultToValue)) {
        alert('wrong range');
        return;
    }    
    setAgeFilter({ to: defaultToValue, from: defaultFromValue });
    _filterEmployeeByAge({ variables: { name: searchInputValue, to: defaultToValue, from: fromValue, sort: sortValue } });


}

export default { setFromAge,setToAge,resetComponents,resetSelect,sortEmployees };