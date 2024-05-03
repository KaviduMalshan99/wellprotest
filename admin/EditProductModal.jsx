import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './EditProductModal.css';

// Define the resizeAndConvertToBase64 function
const resizeAndConvertToBase64 = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg')); // Convert to base64
      };
      img.onerror = function (error) {
        reject(error);
      };
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

const EditProductModal = ({ closeModal, product }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [productData, setProductData] = useState({
    VariantType: '',
    Sizes: [],
    Colors: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [selectedColorName, setSelectedColorName] = useState('');
  const [selectedColorCount, setSelectedColorCount] = useState(0);
  const [selectedColorPrice, setSelectedColorPrice] = useState('');
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [editedVariation, setEditedVariation] = useState(null);
  const [localVariations, setLocalVariations] = useState(product.Variations || []);

  useEffect(() => {
    if (product && product.ProductId) {
      setEditedProduct(product);
      setSelectedImages(product.ImgUrls || []);
      setLocalVariations(product.Variations||[]);
    }
  }, [product]);

  useEffect(() => {
    if (product && product.Areas) {
      setSelectedOptions(product.Areas);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedVariation((prevEditedVariation) => ({
      ...prevEditedVariation,
      [name]: value
    }));
  };
  
  
  

  // Handle variant type change
  const handleVariantChange = (e) => {
    const selectedVariant = e.target.value;
    setProductData((prevProductData) => ({
      ...prevProductData,
      VariantType: selectedVariant,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...editedProduct,
        ImgUrls: selectedImages, // Include selectedImages in the updated product data
        Areas: selectedOptions // Include selectedOptions in the Areas field
      };
  
      // Log updatedProduct to verify that Areas data is included
      console.log("Updated Product:", updatedProduct);
  
      // Send the updated product data to the backend
      const response = await axios.put(`http://localhost:3001/api/updateproduct/${editedProduct.ProductId}`, updatedProduct);
  
      // Check if the update was successful
      if (response.status === 200) {
        toast.success('Product Update Successfully');
        closeModal();
      } else {
        toast.error('Failed to Update the Product');
        console.error('Error updating product:', response.statusText);
      }
    } catch (error) {
      toast.error('Failed to Update the Product');
      console.error('Error updating product:', error);
    }
  };
  

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    const resizedBase64Image = await resizeAndConvertToBase64(file, 300, 300); // Adjust maxWidth and maxHeight as needed
    console.log("Resized Base64 Encoded Image:", resizedBase64Image);
    // Now you can use the resizedBase64Image for further processing, such as uploading to the server
    setSelectedColorImages((prevImages) => [...prevImages, resizedBase64Image]);
};

const handleRemoveImage = (index) => {
  const newImages = [...selectedImages];
  // Remove the image at the specified index
  newImages.splice(index, 1);
  // Update the state with the new array
  setSelectedImages(newImages);
};


const handleAddSize = () => {
  if (sizeInput.trim() !== '' && selectedColorName && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
    const newSize = {
      size: sizeInput.trim(),
      colors: [{ // This assumes each size can have multiple colors
        name: selectedColorName,
        count: selectedColorCount,
        price: selectedColorPrice,
        images: selectedColorImages
      }]
    };

    setProductData(prevData => ({
      ...prevData,
      Sizes: [...prevData.Sizes, newSize]
    }));

    // Reset fields after adding a new size
    setSizeInput('');
    setSelectedColorName('');
    setSelectedColorCount(0);
    setSelectedColorPrice('');
    setSelectedColorImages([]);
    console.log("New Size Data:", newSize); // Log for debugging
  } else {
    console.error("All fields must be filled.");
  }
};

  

  

  const handleAddColor = () => {
    if (selectedColorName && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
      // Create a new color object including name, count, price, and images
      const newColor = {
        name: selectedColorName,
        count: selectedColorCount,
        price: selectedColorPrice,
        images: selectedColorImages
      };

      // Update the product data state with the new color
      setProductData(prevProductData => ({
        ...prevProductData,
        Colors: [...prevProductData.Colors, newColor],
      }));

      // Clear the input fields after adding color
      setSelectedColorName('');
      setSelectedColorCount(0);
      setSelectedColorPrice('');
      setSelectedColorImages([]);
    } else {
      console.error("Please fill in all the required fields.");
    }
  };

  const handleRemoveColor = (index) => {
    const newColors = [...productData.Colors];
    newColors.splice(index, 1);
    setProductData({
      ...productData,
      Colors: newColors,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: checked
    });
  };

  // Handle option selection change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Handle adding option
  const handleAddOption = () => {
    if (selectedOption) {
      setSelectedOptions([...selectedOptions, selectedOption]);
      console.log("Newly Selected Areas:", [...selectedOptions, selectedOption]);
      setSelectedOption('');
    }
  };

  // Handle removing option
  const handleRemoveOption = (index) => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value
    });
  };

  const handleDefaultImageUpload = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        // Resize and convert the image to base64
        const base64String = await resizeAndConvertToBase64(file, 400, 400);
        // Update the selectedImages state with the base64 string
        setSelectedImages((prevImages) => [...prevImages, base64String]);
      } catch (error) {
        console.error('Error resizing and converting image:', error);
      }
    }
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...productData.Sizes];
    newSizes.splice(index, 1);
    setProductData(prevData => ({
      ...prevData,
      Sizes: newSizes
    }));
    console.log("Updated Sizes after removal:", newSizes); // Debugging log
  };
  
  
  const handleSave = () => {
    if (editedVariation && localVariations) {
      const updatedVariations = localVariations.map(variation =>
        variation.name === editedVariation.name ? {
          ...variation,
          name: editedVariation.name,
          count: editedVariation.count,
          price: editedVariation.price,
          images: editedVariation.image ? [URL.createObjectURL(editedVariation.image)] : variation.images
        } : variation
      );
      setLocalVariations(updatedVariations);
      console.log("Updated Variations Details:", updatedVariations);
      setEditedVariation(null);
    }
  };
  
  
  

  const handleCancel = () => {
    setEditedVariation(null); // Clear the edited variation state on cancel
  };

  const handleEdit = (variation, e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Initialize the editing with image data if available
    setEditedVariation({
      ...variation,
      image: variation.images.length > 0 ? variation.images[0] : null
    });
  };
  

  return (
    <div className="editModelContainer">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="boxes">
          {/* Input fields */}
          <div className="mainbox">
            <div>
              <label>1) Product ID:</label>
              <input type="text" className='edpid' name="ProductId" value={editedProduct.ProductId} onChange={handleChange} disabled />
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>2) Product Name:</label>
              <input type="text" name="ProductName" value={editedProduct.ProductName} onChange={handleChange} />
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>5) Select Variant Type:</label>
              <select value={productData.VariantType} onChange={handleVariantChange}>
                <option value="">Select Variant Type</option>
                <option value="Many Sizes with Many Colors">Many Sizes with Many Colors</option>
                <option value="Only Colors">Only Colors</option>
              </select>
            </div>
          </div>

          {productData.VariantType && (
            <div className="mainbox">
              {productData.VariantType === "Many Sizes with Many Colors" && (
                <div>
                  <label>6) Many Sizes with Many Colors:</label>
                  <div>
                    <label>Add Size:</label>
                    <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="Enter size" />
                    <label>Color Name:</label>
                    <input type="text" value={selectedColorName} onChange={(e) => setSelectedColorName(e.target.value)} placeholder="Enter color name" />
                    <label>Available Count:</label>
                    <input type="number" value={selectedColorCount} onChange={(e) => setSelectedColorCount(parseInt(e.target.value, 10))} placeholder="Enter available count" />
                    <label>Price:</label>
                    <input type="number" value={selectedColorPrice} onChange={(e) => setSelectedColorPrice(parseFloat(e.target.value))} placeholder="Enter price" />
                    <input type="file" onChange={handleAddImage} accept="image/*" multiple />
                    <div>
                      {selectedColorImages.map((image, index) => (
                        <div key={index}>
                          <img src={image} alt={`Color Image ${index}`} />
                          <button onClick={() => handleRemoveImage(index)}>Remove Image</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddSize}>Add Size and Color Details</button>
                  </div>


                  {/* Display added sizes */}
                  <div className='sd2'>
                    {productData.Sizes.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="size-item">
                        <span>Size: {size.size}</span>
                        {size.colors.map((color, colorIndex) => (
                          <div key={colorIndex} className="color-item">
                            <span>Color Name: {color.name}</span>
                            <span>Count: {color.count}</span>
                            <span>Price: {color.price}</span>
                            <div>
                              {color.images.map((image, imgIndex) => (
                                <img key={imgIndex} src={image} alt={`Color Image ${sizeIndex}-${colorIndex}-${imgIndex}`} />
                              ))}
                            </div>
                            <button onClick={() => handleRemoveColor(sizeIndex, colorIndex)}>Remove Color</button>
                          </div>
                        ))}
                        <button onClick={() => handleRemoveSize(sizeIndex)}>Remove Size</button>
                      </div>
                    ))}
                  </div>




                  
                </div>
              )}
              {productData.VariantType === "Only Colors" && (
                <div>
                  <label>6) Only Colors:</label>
                  <div>
                    <label>Color Name:</label>
                    <input
                      type="text"
                      value={selectedColorName}
                      onChange={(e) => setSelectedColorName(e.target.value)}
                      placeholder="Enter color name"
                    />
                    <label>Available Count:</label>
                    <input
                      type="number"
                      value={selectedColorCount}
                      onChange={(e) => setSelectedColorCount(e.target.value)}
                      placeholder="Enter available count"
                    />
                    <label>Price:</label>
                    <input
                      type="number"
                      value={selectedColorPrice}
                      onChange={(e) => setSelectedColorPrice(e.target.value)}
                      placeholder="Enter price"
                    />
                    <input type="file" onChange={handleAddImage} accept="image/*" />
                    {/* Display selected images for the current color */}
                    <div>
                      {selectedColorImages.map((image, index) => (
                        <div key={index}>
                          <img src={image} alt={`Color Image ${index}`} />
                          <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={handleAddColor}>Add Color</button>
                  </div>

                  {/* Display added colors */}
                  <div className='sd2'>
                    {productData.Colors.map((color, index) => (
                      <div key={index} className='size-item'>
                        <span>Color Name:{color.name}</span>
                        <span>Count: {color.count}</span>
                        <span>Price:{color.price}</span>
                        <div>
                          {color.images.map((image, imgIndex) => (
                            <img key={imgIndex} src={image} alt={`Color Image ${index}-${imgIndex}`} />
                          ))}
                        </div>
                        <button type="button" onClick={() => handleRemoveColor(index)}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Display Variations */}
              
            </div>
          )}






      <div>
      <h3>Variations:</h3>
      {localVariations.map((variation, index) => (
        <div key={index}>
          <h4>Variation {index + 1}</h4>
          <p>Name: {variation.name}</p>
          <p>Count: {variation.count}</p>
          <p>Price: {variation.price}</p>
          <p>Images:</p>
          <div>
            {variation.images.map((image, imgIndex) => (
              <div key={imgIndex}>
                <img 
                  src={image} 
                  alt={`Variation Image ${index}-${imgIndex}`} 
                  style={{ maxWidth: '200px', maxHeight: '200px' }} // Adjust the max width and height as needed
                />
              </div>
            ))}
          </div>
          {/* Edit button */}
          <button onClick={(e) => handleEdit(variation, e)}>Edit</button>
        </div>
      ))}
      {/* Render editable fields if an edit is in progress */}
      {editedVariation && (
  <div>
    <h4>Edit Variation</h4>
    <label>Name:</label>
    <input type="text" name="name" value={editedVariation.name} onChange={handleChange} />
    <label>Count:</label>
    <input type="text" name='count' value={editedVariation.count} onChange={(e) => handleChange(e)} />
    <label>Price:</label>
    <input type="text" name='price' value={editedVariation.price} onChange={(e) => handleChange(e)} />
    <label>Image:</label>
    <input type="file" onChange={(e) => setEditedVariation({...editedVariation, image: e.target.files[0]})} />
    
    {/* Display the current image and remove button if there is already an image */}
    {editedVariation.image && (
      <div>
        <img 
          src={editedVariation.image instanceof File ? URL.createObjectURL(editedVariation.image) : editedVariation.image} 
          alt="Edited Variation Image"
          style={{ maxWidth: '200px', maxHeight: '200px' }} // Adjust the max width and height as needed
        />
        <button onClick={() => setEditedVariation({...editedVariation, image: null})}>Remove Image</button>
      </div>
    )}
    {/* Save and cancel buttons */}
    <button onClick={handleSave}>Save</button>
    <button onClick={handleCancel}>Cancel</button>
  </div>
      )}
        </div>



          <div className="mainbox">
            <div>
              <label>5) Quick Delivery Available:</label>
              <input type="checkbox" name="QuickDeliveryAvailable" checked={editedProduct.QuickDeliveryAvailable} onChange={handleCheckboxChange} />
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>7) Areas:</label>
              <div className='catdiv'>
                <select value={selectedOption} onChange={handleOptionChange} >
                  <option value="" className='optcat'>Select Areas</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="International">International</option>
                  <option value="Exclusive">Exclusive</option>
                </select>
                <button className='catbtn' type="button" onClick={handleAddOption}>Add Option</button>
              </div>
            </div>

            <div className='selectedclass'>
              {/* Display selected options */}
              <ul>
                {selectedOptions.map((option, index) => (
                  <li key={index}>
                    {option}
                    <button type="button" onClick={() => handleRemoveOption(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mainnbox">
            <div className="desc">
              <label htmlFor="">9) Description</label>
              <textarea name="Description" value={editedProduct.Description} onChange={handleDescriptionChange} rows="10"></textarea>
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>10) Default Images:</label>
              <div className='imagess'>
                <div>
                  <input type="file" accept="image/*" onChange={handleDefaultImageUpload} multiple /> {/* Allow selecting multiple images */}
                </div>
                <div className="image-container">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className='imh'>
                      <img className='dimg' src={imageUrl} alt={`Image ${index}`} />
                      <button type="button" className='dremove' onClick={() => handleRemoveImage(index)}>Remove Image</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProductModal;
