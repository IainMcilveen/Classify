import { gql } from "apollo-boost";
export const USERS = gql`
{
    users{
      id
      email
    }
  }
`;

export const USER = gql`
query user($id: ID!){
    user(id: $id){
        id
        firstName
        lastName
        email
        biography
        schools{
          name
        }
        courses{
            name
            code
          }
    }
}
`;

export const FINDMATCH = gql`
query findMatches($id: ID!){
    findMatches(id: $id) {
      id
      firstName
      lastName
      email
      biography
      courses{
        id
        name
        code
      }
      schools{
        name
      }
    }
  }
`;

export const FINDCOMMONMATCH = gql`
query findCommonMatches($id: ID!){
  findCommonMatches(id: $id) {
    id
    firstName
    lastName
    email
    biography
  }
}
`;

export const ADDTOMATCHLIST = gql`
mutation($profileId: Int!,$userId:Int!){
  addUserToMatchlist(
    profileId: $profileId,
    userId:$userId
  )
}
`;


export const ADDTOBLACKLIST = gql`
mutation($profileId: Int!,$userId:Int!){
  addUserToBlacklist(
    profileId: $profileId,
    userId:$userId
  )
}
`;

export const LOGIN = gql`
query login($email: String!, $password: String!){
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      courses{
        id
      }
    }
  }
`;