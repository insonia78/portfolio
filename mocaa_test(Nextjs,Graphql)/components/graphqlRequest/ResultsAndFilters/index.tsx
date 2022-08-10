import { gql } from '@apollo/client';

const SORT_EMPLOYEES_BY = gql`
mutation sortEmployeeBy($sort:String,$to:String,$from:String,$name:String)
{
    sortEmployeeBy(sort:$sort,to:$to,from:$from,name:$name)
   {
       code
       message
       {
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
const FILTER_EMPLOYEES_BY_AGE = gql`
mutation filterEmployeeByAge($to:String,$from:String,$sort:String,$name:String)
{
    filterEmployeeByAge(to:$to,from:$from,sort:$sort,name:$name)
   {
       code
       message
       {
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

export default { FILTER_EMPLOYEES_BY_AGE,SORT_EMPLOYEES_BY  }