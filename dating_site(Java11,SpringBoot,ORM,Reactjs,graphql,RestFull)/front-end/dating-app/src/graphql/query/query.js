import gql from 'graphql-tag';

const query = gql` 
query{
    members{
        id,
        first_name,
        middle_name,
        last_name,
        gender,
        age,
        hair_color,
        eye_color,
        height,
        weight,
        etnicity,
        message
    }
}
`;
export default query;