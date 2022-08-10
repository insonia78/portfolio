import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import styles from  './css/ResultsAndFilters.module.css';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import  graphqlRequest  from '../../components/graphqlRequest/ResultsAndFilters';
import functions from '../../components/functions/ResultsAndFilters';



const useStyles = makeStyles({
    table: {
        minWidth: 'auto',
    },
});
const ResultsAndFilters = ({ resetPage, setResetPage, data = [], setSearchByName, setAgeFilter, setSortBy, searchInputValue }) => {

    const [defaultToValue, setDefaultToValue] = useState<string>('');
    const [defaultFromValue, setDefaultFromValue] = useState<string>('');
    const [sortValue, setSortValue] = useState<string>('choose_sort');
    const [defaultSortValue, setDefaultSortValue] = useState<string>('choose_sort');
    const classes = useStyles();
    let p = 'pick_age';
    let ageTo = [];
    ageTo.push(<option key={'a' + 0} value={'pick_age'} >Pick Age</option>);
    for (let i = 1; i <= 100; i++) {
        ageTo.push(<option key={'a' + i} value={i} >{i}</option>);
    }
      
     

    const [_filterEmployeeByAge] = useMutation(graphqlRequest.FILTER_EMPLOYEES_BY_AGE, {
        onError(err) {
            console.log(err);
            alert(err);
        },
        update(proxy, result) {
            console.log(result);
            if (result.data.filterEmployeeByAge.code !== 200) {
                alert(result.data.filterEmployeeByAge.message);
                return;
            }
            setSearchByName(result.data.filterEmployeeByAge.message);

        }

    });
   

    const [sortEmploeesBy] = useMutation(graphqlRequest.SORT_EMPLOYEES_BY, {
        onError(err) {
            console.log(err);
            alert(err);
        },
        update(proxy, result) {
            console.log(result);
            if (result.data.sortEmployeeBy.code !== 200) {
                alert(result.data.sortEmployeeBy.message);
                return;
            }
            setSearchByName(result.data.sortEmployeeBy.message);
        }

    });
    
    useEffect(() => {
        if (resetPage) {
            functions.resetComponents(setDefaultToValue,setDefaultFromValue,setDefaultSortValue);
            setResetPage(false);
        }

    })

    return (
        <div className={styles.results_and_filter_container}>

            <div className={styles.filters}>
                <div className = {styles.filters_container}>
                    <h2>FILTERS</h2>
                    <fieldset className={styles.age}>
                        <legend>AGE</legend>
                        <label>To:</label>
                        <select value={defaultToValue} onFocus={()=>functions.resetSelect(setDefaultToValue,setDefaultFromValue) } onChange={(e:any)=>functions.setToAge(e.target.value,setDefaultToValue)}>
                            {
                                ageTo
                            }
                        </select>
                        <label>From:</label>

                        <select onChange={(e:any)=>{
                            console.log(e.target.value);
                            functions.setFromAge(
                                setDefaultFromValue,
                                setAgeFilter,_filterEmployeeByAge,searchInputValue,
                                e.target.value,defaultToValue,defaultFromValue,sortValue)}} value={defaultFromValue}>
                            {
                                ageTo
                            }
                        </select>
                    </fieldset>
                </div>
            </div>

            <div className={styles.results}>
                <div className={styles.select_container}>
                    <label>{'Sort By:   '}</label>
                    <select value={defaultSortValue} onChange={(e:any)=>
                        functions.sortEmployees(e,setDefaultSortValue,setSortValue,
                            setSortBy,sortEmploeesBy,
                            searchInputValue,defaultToValue,
                            defaultFromValue,sortValue)
                        } >
                        <option key='1aa' value='choose_sort'>Choose Sort</option>
                        <option key='1a' value='first_name' >First Name</option>
                        <option key='1b' value='last_name' >Last Name</option>
                        <option key='1c' value='age' >Age</option>
                        <option key='1d' value='email' >Email</option>
                        <option key='1e' value='title' >Title</option>
                        <option key='1f' value='start_date' >Start Date</option>
                    </select>
                </div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="right">First Name</TableCell>
                                <TableCell align="right">Middle Name</TableCell>
                                <TableCell align="right">Last Name</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Title</TableCell>
                                <TableCell align="right">Start Date</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell scope="row">
                                        {row.first_name}
                                    </TableCell>
                                    <TableCell align="right">{row.middle_name}</TableCell>
                                    <TableCell align="right">{row.last_name}</TableCell>
                                    <TableCell align="right">{row.age}</TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    <TableCell align="right">{row.title}</TableCell>
                                    <TableCell align="right">{row.start_date}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>


    )
}

export default ResultsAndFilters;