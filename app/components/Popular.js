import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import {useQuery, useLazyQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

const GET_REPOS = gql`
  query GET_REPOS($query: String! ) { 
    search(first: 30, query: $query, type: REPOSITORY) {
      edges {
        node {
          ... on Repository {
            name
            description
            url
            forkCount
            stargazers {
              totalCount
            }
            issues (states: OPEN) {
              totalCount
            }
            owner {
              avatarUrl
              login
            }
          }
        }
      }
    }
  }
`;

function LangaugesNav ({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='flex-center'>
      {languages.map((language) => (
        <li key={language}>
          <button
            className='btn-clear nav-link'
            style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}
            onClick={() => onUpdateLanguage(language)}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LangaugesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid ({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, url, stargazers, forkCount, issues } = repo
        const { login, avatarUrl } = owner

        return (
          <li key={url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatarUrl}
              href={url}
              name={login}
            >
              <ul className='card-list'>
                <li>
                  <Tooltip text="Github username">
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>
                      {login}
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color='rgb(255, 215, 0)' size={22} />
                  {stargazers.totalCount.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                  {forkCount.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                  {issues.totalCount.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function popularReducer(state, action) {
  if (action.type === "success") {
    return {
      ...state,
      [action.selectedLanguage]: action.repos
    }
  } else if (action.type === "error") {
    return {
      ...state,
      error: action.error.message
    }
  } else  {
    throw new Error(`Action ${action.type} not recognized`);
  }
}

function useRepos(selectedLanguage) {
  const {loading } = useQuery(GET_REPOS, {
    variables:  {query: `stars:>1 language:${selectedLanguage} sort:stars`},
    onCompleted: (data) =>  {
      dispatch({type: 'success', selectedLanguage, repos: mapToRepos(data)})
    },
    onError: (error) => dispatch({type: 'error', error})
  });

  const [state, dispatch] = React.useReducer(popularReducer, {
    error: null,
  });
  
  function mapToRepos(data) {
    return data.search.edges.map(edge => edge.node);
  }

  return {loading, state}
}

export default function Popular() {
  
  const [selectedLanguage, setSelectedLanguage] = React.useState('All');
  const {loading, state} = useRepos(selectedLanguage);
  
  const isLoading = () => {
    return loading && !state[selectedLanguage] && state.error === null
  };

  return (
    <React.Fragment>
      <LangaugesNav
        selected={selectedLanguage}
        onUpdateLanguage={setSelectedLanguage}
      />

      {isLoading() && <Loading text='Fetching Repos' />}

      {state.error && <p className='center-text error'>{state.error.message}</p>}

      {state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
    </React.Fragment>
  )
}