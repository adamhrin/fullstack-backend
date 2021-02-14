import React from 'react'

const Filter = (props) => (
  <div>
    filter shown with
    <input value={props.filter} onChange={props.filterChangeHandler}/>
  </div>
)

export default Filter