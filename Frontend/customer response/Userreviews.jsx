import React, { useState, useEffect } from 'react';
import './Userreviews.css'
import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';

const Userreviews = () => {

  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [updatedReviewTitle, setUpdatedReviewTitle] = useState('');
  const [updatedReviewBody, setUpdatedReviewBody] = useState('');
  const [updatedRateCount, setUpdatedRateCount] = useState('');
  const [updatedReviewImage, setUpdatedReviewImage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios.get('http://localhost:3001/api/reviews')
      .then(response => {
        setReviews(response.data.response);
      })
      .catch(error => {
        // console.error('Error fetching reviews:', error);
        console.error('Error:', error);
        console.log('Response:', error.response); // Log the response for more details
      });
  };

  const handleDelete = (ReviewID) => {
    fetch(`http://localhost:3001/api/deletereview/${ReviewID}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      // Filter out the deleted review from the reviews array
      const updatedReviews = reviews.filter(review => review.ReviewID !== ReviewID);
      setReviews(updatedReviews);
      toast.success('Review deleted successfully'); // Show success toast
    })
      .catch(error => console.error('Error deleting review:', error));
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setUpdatedReviewTitle(review.ReviewTitle);
    setUpdatedReviewBody(review.ReviewBody);
    setUpdatedRateCount(review.Ratecount);
    setUpdatedReviewImage(review.ReviewImage);
  };

 const handleUpdate = () => {
  if (!editReview || !editReview.ReviewID) {
    console.error('Cannot update review: ReviewID is missing or undefined');
    return;
  }

  const { ReviewID } = editReview;
  const rateCount = Math.min(Math.max(parseInt(updatedRateCount) || 0, 0), 5);

  // Construct the correct update URL with the valid ReviewID
  const updateUrl = (`http://localhost:3001/api/updatereview/${ReviewID}`);

  axios.post(updateUrl, {
    ReviewTitle: updatedReviewTitle,
    ReviewBody: updatedReviewBody,
    Ratecount: rateCount,
    ReviewImage: updatedReviewImage
  })
    .then(res => {
      console.log('Update successful:', res.data);

      // Update the local reviews state
      const updatedReviews = reviews.map(prevReview =>
        prevReview.ReviewID === ReviewID ? {
          ...prevReview,
          ReviewTitle: updatedReviewTitle,
          ReviewBody: updatedReviewBody,
          Ratecount: rateCount,
          ReviewImage: updatedReviewImage
        } : prevReview
      );
      setReviews(updatedReviews);
      setEditReview(null); // Clear edit mode
      toast.success('Review updated successfully');
    })
    .catch(err => {
      console.error('Error updating review:', err);

      // Log more details about the Axios error
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      }
    });
};
  
  const renderStars = (rateCount) => {
    const filledStars = rateCount;
    const emptyStars = 5 - rateCount;

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={i} className='star filled'>&#9733;</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={filledStars + i} className='star'>&#9734;</span>);
    }
    return stars;
  };

  return (
    <div className='ReviewUser_main'>
    <table className='ReviewUsertable'>
      <thead>
        <tr>
          <th className='usetheader1'>Review Number</th>
          <th className='usetheader2'>Review Titles</th>
          <th className='usetheader3'>Reviews</th>
          <th className='usetheader4'>Ratings</th>
          <th className='usetheader5'>ReviewImage</th>
          <th className='usetheader6'>Actions</th>
        </tr>
      </thead>
      <tbody>
      {reviews.map(review => (
            <tr key={review.ReviewID}>
              <td>{review.ReviewNum}</td>
              <td>{editReview === review ? <input type="text" value={updatedReviewTitle} onChange={e => setUpdatedReviewTitle(e.target.value)} /> : review.ReviewTitle}</td>
              <td>{editReview === review ? <textarea value={updatedReviewBody} onChange={e => setUpdatedReviewBody(e.target.value)} /> : review.ReviewBody}</td>
              <td>
                {editReview === review ? (
                  <input
                    type="number"
                    value={updatedRateCount}
                    min="0"
                    max="5"
                    onChange={e => setUpdatedRateCount(e.target.value)}
                  />
                ) : (
                  renderStars(review.Ratecount)
                )}
              </td>
              <td>
                {/* Display image if review has ReviewImage */}
                {review.ReviewImage && <img src={review.ReviewImage} alt="Review Image" className="review-image" />}
              </td>
              <td className="urembtncon">

              
                {editReview === review ? (
                  <><div className="revmsavbtn">
                    <button className='ReviewUser_Edit' onClick={handleUpdate}>Save</button>
                    <button className='ReviewUser_Delete' onClick={() => setEditReview(null)}>Cancel</button></div>
                  </>
                ) : (
                  <>
                    <button className='ReviewUser_Edit' onClick={() => handleEdit(review)}>Edit</button>
                    <button className='ReviewUser_Delete' onClick={() => handleDelete(review.ReviewID)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        {/* Repeat the above row template for each row */}
      </tbody>
    </table>
    <ToastContainer />
    </div>
  )
}

export default Userreviews