import React from 'react';

export const SelectOption = props => (
  <div className={props.chartClass} id="option">
    <select className="form-control" name="Change chart" onChange={props.handleChartChange}>
      <option selected disabled>Choose prefered chart</option>
      <option value={props.firstValue}>{props.firstOption}</option>
      <option value={props.secondValue}>{props.secondOption}</option>
    </select>
  </div>
);

export const DisplayOption = props => (
  <div className={props.chartClass} id="selectoption">
    <select className="form-control" name="Change chart" onChange={props.handleOptionChange}>
      <option selected value="selected" disabled>Choose prefered stat</option>
      <option value={props.firstValue}>{props.firstOption}</option>
      <option value={props.secondValue}>{props.secondOption}</option>
    </select>
  </div>
);

