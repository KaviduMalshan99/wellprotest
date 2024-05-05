import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './EditProductModel.scss';

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
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const EditProductModal = ({ closeModal, product }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [productData, setProductData] = useState({
    VariantType: '',
    Sizes: [],
    Colors: [],
    Categories:editedProduct.Categories || []
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
      setProductData({...productData,Categories:product.Categories || []});
    }
  }, [product]);

  useEffect(() => {
    if (product && product.Areas) {
      setSelectedOptions(product.Areas);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevEditedVariation) => ({
      ...prevEditedVariation,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setProductData((prevProductData) => {
      const newCategories = prevProductData.Categories.includes(category)
        ? prevProductData.Categories.filter((cat) => cat !== category)
        : [...prevProductData.Categories, category];
      return {
        ...prevProductData,
        Categories: newCategories
      };
    });
  };

  

  const handleVariantChange = (e) => {
    const selectedVariant = e.target.value;
    setProductData((prevProductData) => ({
      ...prevProductData,
      VariantType: selectedVariant,
    }));
  };

  const handleRemoveVariation = (index) => {
    setLocalVariations((currentVariations) => currentVariations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...editedProduct,
        ImgUrls: selectedImages,
        Areas: selectedOptions,
        Variations: [...localVariations, ...productData.Sizes, ...productData.Colors],  // Combining existing variations with new sizes and colors
        Sizes: productData.Sizes,
        Colors: productData.Colors,
        Categories:productData.Categories,
      };

      console.log("Submitting Updated Product:", updatedProduct);

      const response = await axios.put(`http://localhost:3001/api/updateproduct/${editedProduct.ProductId}`, updatedProduct);
      if (response.status === 200) {
        toast.success('Product updated successfully');
        closeModal();
      } else {
        toast.error('Failed to update the product');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update the product');
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    const resizedBase64Image = await resizeAndConvertToBase64(file, 300, 300);
    setSelectedColorImages((prevImages) => [...prevImages, resizedBase64Image]);
    console.log("Resized Base64 Encoded Image:", resizedBase64Image);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (sizeInput.trim() !== '' && selectedColorName && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
      const newSize = {
        size: sizeInput.trim(),
        colors: [{
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

      console.log("New Size Data:", newSize);

      setSizeInput('');
      setSelectedColorName('');
      setSelectedColorCount(0);
      setSelectedColorPrice('');
      setSelectedColorImages([]);
    } else {
      console.error("All fields must be filled.");
    }
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (selectedColorName && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
      const newColor = {
        name: selectedColorName,
        count: selectedColorCount,
        price: selectedColorPrice,
        images: selectedColorImages
      };

      setProductData(prevProductData => ({
        ...prevProductData,
        Colors: [...prevProductData.Colors, newColor]
      }));

      console.log("New Color Data:", newColor);

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

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddOption = () => {
    if (selectedOption) {
      setSelectedOptions([...selectedOptions, selectedOption]);
      console.log("Newly Selected Areas:", [...selectedOptions, selectedOption]);
      setSelectedOption('');
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);
  };

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
        const base64String = await resizeAndConvertToBase64(file, 400, 400);
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
    console.log("Updated Sizes after removal:", newSizes);
  };

  

  const handleEdit = (variation, e) => {
    e.preventDefault();
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
            <div className='editcategory'>
              <label>3) Categories:(*)</label>
              <div className="category-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    name="Men"
                    checked={productData.Categories.includes("Men")}
                    onChange={() => handleCategoryChange("Men")}
                    disabled={productData.Categories.includes("Women")}
                  />
                  Men
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Women"
                    checked={productData.Categories.includes("Women")}
                    onChange={() => handleCategoryChange("Women")}
                    disabled={productData.Categories.includes("Men")}
                  />
                  Women
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Bags"
                    checked={productData.Categories.includes("Bags")}
                    onChange={() => handleCategoryChange("Bags")}
                    disabled={productData.Categories.includes("Shoes")}
                  />
                  Bags
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Shoes"
                    checked={productData.Categories.includes("Shoes")}
                    onChange={() => handleCategoryChange("Shoes")}
                    disabled={productData.Categories.includes("Bags")}
                  />
                  Shoes
                </label>
              </div>
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>4) Select Variant Type:</label>
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
                  <label>5) Many Sizes with Many Colors:</label>
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
                  <label>5) Only Colors:</label>
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
              
            </div>
          )}



      <div className='variants'>
        <h3>Variations:</h3>
        {localVariations.map((variation, index) => (
          <div className='variant' key={index}>
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
            <button onClick={() => handleRemoveVariation(index)}>Remove</button>
          </div>
        ))}
     </div>



          <div className="mainbox">
            <div>
              <label>6) Quick Delivery Available:</label>
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
              <label htmlFor="">8) Description</label>
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
        <button type="submit" className='editsave'>Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProductModal;
