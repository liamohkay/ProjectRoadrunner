import React from 'react';

const SortForm = (props) => (
    <select className="text" className="sort" onChange={props.updateParamFunc}>
      {props.sortParameters.map((param, i) => (
        <option value={param} key={i}>
          {param}
        </option>
      ))}
    </select>
);

export default SortForm;
