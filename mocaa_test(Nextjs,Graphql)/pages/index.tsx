import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import SearchIcon from '@material-ui/icons/Search';
import { gql, useMutation } from '@apollo/client';
import ResultsAndFilters from './ResultsAndFilters';


const FIND_EMPLOYEE = gql`
mutation searchEmployer($name:String,$to:String,$from:String,$sort:String)
{
   searchEmployer(name:$name,to:$to,from:$from,sort:$sort)
   {
       code
       message{
       first_name
       middle_name
       last_name
       age
       email
       id
       start_date
       title
       }
   }
}
`;
const ALL_EMPLOYEES = gql`
mutation getAllEmployees
{
  getAllEmployees
   {
       code
       message{
       first_name
       middle_name
       last_name
       age
       email
       id
       start_date
       title
       }
   }
}
`;
let allTheData:any[] = undefined;
export default function Home() {

  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [searchByName, setSearchByName] = useState([]);
  const [switchDisplay, setSwitchDisplay] = useState<boolean>(false);
  const [ageFilter,setAgeFilter] = useState({to:'',from:''});
  const [resetPage,setResetPage ] = useState<boolean>(false);
  const[sortBy,setSortBy] = useState<string>('choose_sort');

  const [getEmployees, { loading: mutationLoading, error: mutationError },] = useMutation(FIND_EMPLOYEE, {
    onError(err) {
      console.log(err);
      alert(err);
    },
    update(proxy, result) {
      if(result.data.searchEmployer.code !== 200)
      {
        alert(result.data.message);
        return;
      }
      if(result.data.searchEmployer.message.length === 0)
      {
         alert('No Data Retreved');
         setSearchByName([]);
      }
      else
        setSearchByName(result.data.searchEmployer.message);
      
    }

  });

  const [getAllEmployees] = useMutation(ALL_EMPLOYEES, {
    onError(err) {
      console.log(err);
      alert(err);
    },
    update(proxy, result) {
    
      if(result.data.getAllEmployees.code !== 200)
      {
        alert(result.data.getAllEmployees.message);
        return;
      }
      if(result.data.getAllEmployees.message.length === 0)
      {
         alert('No Data Retreved');
         setSearchByName([]);
      }
      else
      {
        allTheData = result.data.getAllEmployees.message;
        setSearchByName(result.data.getAllEmployees.message);
      }
    }

  }); 
  const inputValue = (e) => {
    setResetPage(false);
    console.log('value to serach', e.target.value, ageFilter.to ,ageFilter.from);
    setSearchInputValue(e.target.value); 
    if(e.target.value === "")
       getAllEmployees();
    else   
      getEmployees({ variables: { name: e.target.value,
        to:ageFilter.to,
        from:ageFilter.from,sort:sortBy} });
    e.target.value = "";
  }
  const clearInput = () => {
    setSearchInputValue('');
    setAgeFilter({to:'',from:''});
    getAllEmployees();
    setResetPage(true);

  }
 
    if(allTheData === undefined)
    {      
       getAllEmployees();
    }

  
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Mocaa Test</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { <header className={styles.header}>
         
            <>
            <input onFocus={clearInput} placeholder='Search' type='text'
              value={searchInputValue}
              onChange={inputValue}
              className={styles.input_search}
              onClick={clearInput}              
              />
            </>
               

      </header> }
      <main className={styles.main}>     
        <ResultsAndFilters resetPage={resetPage}  setResetPage={setResetPage} searchInputValue={searchInputValue}   setSortBy={setSortBy} setAgeFilter={setAgeFilter}  data={(searchByName === undefined? []:searchByName)}  setSearchByName={setSearchByName}/>
      </main>
    </div>


  )
}
