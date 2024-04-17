import React from 'react'
import './Review.css';

const Ratings = () => {
  return (
    <div className='Review_main'>
          <table className='Reviewtable'>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Date</th>
          <th>Customer Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows go here */}
        <tr>
          <td>{/* Customer ID */}</td>
          <td>{/* Date */}</td>
          <td>{/* Customer Name */}</td>
          <td>
            <button className='Review_viewmore' onClick={() => {/* View More action */}}>View More</button>
          </td>
        </tr>
        {/* Repeat the above row template for each row */}
      </tbody>
    </table>
    </div>
  )
}

export default Ratings