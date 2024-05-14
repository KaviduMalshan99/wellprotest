import React from "react";

const ExtendedWarehouseRow = ({ id, country, city, address, onDelete, onUpdate }) => (
  <tr className="whvtr">
    <td className="whvtd">{id}</td>
    <td className="whvtd">{country}</td>
    <td className="whvtd">{city}</td>
    <td className="whvtd">{address}</td>
    
    <td className="whvtd">
      <button className= "whvim" onClick={onUpdate}>Update</button>
      <button className= "whvim" onClick={onDelete}>Delete</button>
    </td>
  </tr>
);

export default ExtendedWarehouseRow;
