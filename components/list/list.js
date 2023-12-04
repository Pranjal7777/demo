import React from "react";

function List(props) {
  return (
    <li className="nav-item">
      <a className="nav-link" href="#">
        {props.value}
      </a>
    </li>
  );
}
export default List;
