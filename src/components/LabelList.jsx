/* eslint-disable react/prop-types */
import { useLabelsData } from '../helpers/useLabelsData'

export default function LabelList({ selected, toggle }) {
  const labelsQuery = useLabelsData()
  return (
    <div className="labels">
      <h3>Labels</h3>
      {labelsQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {labelsQuery.data.map((label) => (
            <li key={label.id}>
              <button
                onClick={() => toggle(label.name)}
                className={`label ${
                  selected.includes(label.name) ? 'selected' : ''
                } ${label.color}`}
              >
                {label.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
