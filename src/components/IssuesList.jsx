/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useQuery } from 'react-query'
import { IssueItem } from './IssueItem'
import fetchWithError from '../helpers/fetchWithError'
import { Loader } from './Loader'

export default function IssuesList({ labels, status }) {
  const [searchValue, setSearchValues] = useState('')
  const issuesQuery = useQuery(['issues', { labels, status }], ({ signal }) => {
    const statusString = status ? `&status=${status}` : ''
    const labelsString = labels.map((label) => `labels[]=${label}`).join('&')
    return fetchWithError(`/api/issues?${labelsString}${statusString}`, {
      signal,
    })
  })

  const searchQuery = useQuery(
    ['issues', 'search', searchValue],
    ({ signal }) => {
      return fetch(`/api/search/issues?q=${searchValue}`, { signal }).then(
        (res) => res.json()
      )
    },
    {
      enabled: searchValue.length > 0,
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const value = String(data.get('search'))
    setSearchValues(value)
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setSearchValues('')
            }
          }}
        />
      </form>
      <h2>
        Issues List {issuesQuery.fetchStatus === 'fetching' ? <Loader /> : null}
      </h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === 'idle' &&
        searchQuery.isLoading === true ? (
        <ul className="issues-list">
          {issuesQuery.data.map((issue) => (
            <IssueItem
              key={issue.id}
              title={issue.title}
              number={issue.number}
              assignee={issue.assignee}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              status={issue.status}
            />
          ))}
        </ul>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    title={issue.title}
                    number={issue.number}
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    labels={issue.labels}
                    status={issue.status}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
