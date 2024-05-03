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

  useEffect(() => {
    if (product && product.ProductId) {
      setEditedProduct(product);
      setSelectedImages(product.ImgUrls || []);
    }
  }, [product]);

  useEffect(() => {
    if (product && product.Areas) {
      setSelectedOptions(product.Areas);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value
    });
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
        ImgUrls: selectedImages,
        Areas: selectedOptions,
        Variations: productData.Sizes
      };

      // Log updatedProduct to verify that VariantType data is included
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
  newImages.splice(index, 1);
  setSelectedImages(newImages);
};


const handleAddSize = () => {
  if (sizeInput.trim() !== '' && selectedColorName && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
    // Log the size before updating the state
    console.log("Size added:", sizeInput.trim());
    
    // Create a new size object including color name, count, price, and images
    const newSize = {
      size: sizeInput.trim(),
      color: {
        name: selectedColorName,
        count: selectedColorCount,
        price: selectedColorPrice,
        images: selectedColorImages
      }
    };

    // Log the new size data
    console.log("New Size Data:", newSize);

    // Update the product data state with the new size
   
      setProductData({
        ...productData,
        Sizes: [...productData.Sizes, newSize],
      });


    // Clear the input fields after adding size
    setSizeInput('');
    setSelectedColorName('');
    setSelectedColorCount(0);
    setSelectedColorPrice('');
    setSelectedColorImages([]);
  } else {
    // Log an error if any of the required fields is missing
    console.error("Please fill in all the required fields.");
  }
};
  

  const handleRemoveSize = (index) => {
    const newSizes = [...productData.Sizes];
    newSizes.splice(index, 1);
    setProductData({
      ...productData,
      Sizes: newSizes,
    });
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
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Enter size"
                    />
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
                    <button type="button" onClick={handleAddSize}>Add Details</button>
                  </div>

                  {/* Display added sizes */}
                  <div className='sd2'>
                    {productData.Sizes.map((size, index) => (
                      <div key={index} className='size-item'>
                        <span>Size: {size.size}</span>
                        <span>Color Name: {size.color.name}</span>
                        <span>Count: {size.color.count}</span>
                        <span>Price: {size.color.price}</span>
                        <div>
                          {size.color.images.map((image, imgIndex) => (
                            <img key={imgIndex} src={image} alt={`Size Image ${index}-${imgIndex}`} />
                          ))}
                        </div>
                        <button type="button" onClick={() => handleRemoveSize(index)}>Remove</button>
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
              <div>
                <h3>Variations:</h3>
                {product.Variations && product.Variations.map((variation, index) => (
                  <div key={index}>
                    <h4>Variation {index + 1}</h4>
                    <p>Size: {variation.size}</p>
                    <p>Name: {variation.name}</p>
                    <p>Count: {variation.count}</p>
                    <p>Price: {variation.price}</p>
                    <p>Images:</p>
                    <div>
                      {variation.images.map((image, imgIndex) => (
                        <img key={imgIndex} src={image} alt={`Variation Image ${index}-${imgIndex}`} />
                      ))}
                    </div>
                    {/* Add remove button for each variation */}
                    <button type="button" onClick={() => handleRemoveSize(index)}>Remove Variation</button>
                  </div>
                ))}
              </div>

            </div>
          )}

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
