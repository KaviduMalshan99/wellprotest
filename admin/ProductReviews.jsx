import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductReviews.css';
import moment from 'moment';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []); // Empty dependency array to run once on mount

  const fetchReviews = () => {
    axios.get('http://localhost:3001/api/reviews')
      .then(response => {
        const reviewsWithFormattedDate = response.data.response.map(review => ({
          ...review,
          Date: moment(review.Date).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss')
        }));
        setReviews(reviewsWithFormattedDate);
      })
      .catch(error => {
        console.error('Error fetching review data:', error);
      });
  };

  const openReviewModal = (reviewID) => {
    axios.get(`http://localhost:3001/api/review/${reviewID}`)
      .then(response => {
        console.log('Retrieved review data:', response.data);
        setSelectedReview(response.data); // Assuming response.data is an object containing review data
        setShowForm(true); // Show the form
      })
      .catch(error => {
        console.error('Error fetching review data:', error);
        if (error.response && error.response.status === 404) {
          alert('Review not found');
        }
      });
  };

  const renderStarRating = (ratingCount) => {
    const maxStars = 5;
    const filledStars = Math.round(ratingCount);
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      if (i < filledStars) {
        stars.push(<span key={i}>&#9733;</span>); // Filled star
      } else {
        stars.push(<span key={i}>&#9734;</span>); // Empty star
      }
    }

    return stars;
  };

  const closeForm = () => {
    setShowForm(false); // Hide the form
    setSelectedReview(null); // Reset selected review
  };

  const handleAccept = () => {
    // Handle accept logic here, e.g., navigate back to table or update review status
    // Example: navigate back to table (scroll to top)
    window.scrollTo(0, 0);
    setShowForm(false); // Hide the form
    setSelectedReview(null); // Reset selected review
  };

  
  const handleRemove = () => {
    if (!selectedReview || !selectedReview.review) return;
  
    const reviewID = selectedReview.review.ReviewID;
  
    axios.delete(`http://localhost:3001/api/deletereview/${reviewID}`)
      .then(response => {
        console.log('Review deleted successfully:', response.data);
        const updatedReviews = reviews.filter(review => review.ReviewID !== reviewID);
        setReviews(updatedReviews);
        setShowForm(false);
        setSelectedReview(null);
  
        // Refetch reviews after deletion
        fetchReviews(); // Trigger a new fetch to update the reviews
      })
      .catch(error => {
        console.error('Error deleting review:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        }
        alert('Failed to delete review. Please try again.');
      });
  };

  

  return (
    <div className='ProductReviews_main'>
      <table className='ProductReviews_table'>
        <thead>
          <tr>
            <th className='review_theader1'>Select</th>
            <th className='review_theader2'>ReviewID</th>
            <th className='review_theader3'>ItemID</th>
            <th className='review_theader4'>Date</th>
            <th className='review_theader5'>CustomerID</th>
            <th className='review_theader6'>Customer Name</th>
            <th className='review_theader7'>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <tr key={review?.ReviewID}>
                <td>
                  <input type="checkbox" className='checkbox-custom'/>
                </td>
                <td>{review?.ReviewID}</td>
                <td>{review?.ProductID}</td>
                <td>{review?.Date}</td>
                <td>{review?.CustomerID}</td>
                <td>{review?.CustomerName}</td>
                <td>
                  <button className='Review_viewmore' onClick={() => openReviewModal(review.ReviewID)}>View More</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No reviews found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && selectedReview && (
        <div className="popupform">
          <h2><u>Added Review</u></h2>
          <h3>View the review</h3>
          <form>
          <div className="form-element">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={selectedReview.review.CustomerName} disabled/>
              </div>
              <div className="form-element">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" value={selectedReview.review.CustomerEmail} disabled/>
              </div>
              <div className="form-element">

                  <label htmlFor="rating">Rating</label><br />
                  <div className='stars'>
                  {renderStarRating(selectedReview.review.Ratecount)}
                </div>
              </div>
              <div className="form-element">
                <label htmlFor="reviewTitle">Review Title</label>
                <input type="text" id="reviewTitle" value={selectedReview.review.ReviewTitle} disabled/>
              </div>
              <div className="form-element">
                <label htmlFor="reviewBody">Body of Review</label>
                <textarea name="options" id="reviewBody" cols="40" rows="5" value={selectedReview.review.ReviewBody} disabled/>
              </div>
              {/* Render image here */}
              <div className="form-element">
              <label htmlFor="reviewImage">Review Image</label>
              <br />
              <img src={selectedReview.review.ReviewImage} alt="Review" style={{marginLeft: "30px", marginTop: "10px", borderRadius: "5px"}}/>
              </div>
            <div className='review-btn-container'>
              <center>             
                 <div className="Accept-btn">
              <button className="btn2" onClick={handleAccept}>Accept</button>
              </div>
              <div className="Remove-btn">
              <button className="btn3" onClick={handleRemove}>Remove</button>
              </div>
              </center>
            </div>
          </form>
          <button className="close-btn" onClick={closeForm}>X</button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
