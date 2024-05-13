import  { useState, useEffect } from 'react';
import './AddProductModel.scss';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';


// Define the resizeAndConvertToBase64 function
const resizeAndConvertToBase64 = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(event) {
          const img = new Image();
          img.src = event.target.result;
          img.onload = function() {
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
          img.onerror = function(error) {
              reject(error);
          };
      };
      reader.onerror = function(error) {
          reject(error);
      };
  });
};


const AddProductModel = ({onClose}) => {
  const [productData, setProductData] = useState({
    ProductId: '',
    ProductName: '',
    Categories: [],
    Price: '',
    Areas:[],
    Sizes: [],
    Colors: [],
    QuickDeliveryAvailable: false,
    ImgUrls: [],
    Description:'',
  });

  


  const [products, setProducts] = useState([]);
  const [selectedColorCount, setSelectedColorCount] = useState(0);
  const [selectedColorImages, setSelectedColorImages] = useState([]); // Images for selected color
  const [defaultImages, setDefaultImages] = useState([]); // Default images
  const [sizeInput, setSizeInput] = useState('');
  const [selectedColorName, setSelectedColorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [priceError, setPriceError] = useState('');
  const [selectedColorPrice,setSelectedColorPrice]=useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White'];

  useEffect(() => {
    console.log("Selected Categories:", productData.Categories);
  }, [productData.Categories]); // Log the selected categories whenever it changes



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'Price' && !/^\d*\.?\d*$/.test(value)) {
      // If the entered value is not a valid number or decimal
      setPriceError('Price should be a number or decimal');
    } else {
      // Clear the error message if the entered value is valid
      setPriceError('');
    }
  
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  

  
  

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProductData({
      ...productData,
      [name]: checked,
    });
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };


  const getAvailableCount = () => {
    // Calculate total available count based on sizes and colors
    let totalAvailableCount = 0;
  
    // Sum up the counts of all sizes
    productData.Sizes.forEach((size) => {
      totalAvailableCount += parseInt(size.count);
    });
  
    // Sum up the counts of all colors
    productData.Colors.forEach((color) => {
      totalAvailableCount += parseInt(color.count);
    });
  
    return totalAvailableCount;
  };

  const generateProductId = () => {
    // Generate a random four-digit number
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `P${randomNumber}`;
  };

  const handleCategoryChange = (category) => {
    // If the category is already selected, remove it
    if (productData.Categories.includes(category)) {
      setProductData((prevProductData) => ({
        ...prevProductData,
        Categories: prevProductData.Categories.filter((cat) => cat !== category && cat !== ''),
      }));
    } else {
      // If selecting a new category, check if it exceeds the limit of two categories
      if (productData.Categories.length < 2) {
        setProductData((prevProductData) => ({
          ...prevProductData,
          Categories: [...prevProductData.Categories.filter(cat => cat !== ''), category],
        }));
      } else {
        // If two categories are already selected, don't allow selecting more
        alert("You can only select two categories.");
      }
    }
  };
  
  

  const handleAddProduct = async () => {

    if (!productData.ProductName.trim()) {
      toast.error('Product Name is required.');
      return;
    }
  
    // Check if at least one category is selected
    if (productData.Categories.length === 0) {
      toast.error('Please select at least one category.');
      return;
    }
  
    // Check if at least one area is selected
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one area.');
      return;
    }
  
    // Check if at least one default image is added
    if (defaultImages.length === 0) {
      toast.error('Please add at least one default image.');
      return;
    }


    const productId = generateProductId();
  
    // Set the generated product ID in the productData state
    setProductData(prevProductData => ({
      ...prevProductData,
      ProductId: productId,
      Categories: [...prevProductData.Categories, selectedCategory]
    }));
  
    // Prepare variations array based on the selected variant type
    let Variations = [];
    if (productData.VariantType === "Many Sizes with Many Colors") {
      // Prepare variations based on sizes and colors
      Variations = productData.Sizes.map(size => ({
        size: size.size,
        name: size.color.name,
        count: size.color.count,
        images: size.color.images,
        price: size.color.price
      }));
    } else if (productData.VariantType === "Only Colors") {
      // Prepare variations based on colors only
      Variations = productData.Colors.map(color => ({
        size: '', // No size for colors-only variant
        name: color.name,
        count: color.count,
        images: color.images,
        price: color.price
      }));
    }
  
    const updatedProductData = {
      ...productData,
      ProductId: productId,
      ImgUrls: [...productData.ImgUrls, ...defaultImages, ...selectedColorImages],
      AvailableCount: getAvailableCount(),
      Areas: getAreas(),
      Description: productData.Description,
      Categories: productData.Categories,
      Variations: Variations 
    };
  
    axios
      .post('http://localhost:3001/api/addproduct', updatedProductData)
      .then((response) => {
        setProducts((prevProducts) => [...prevProducts, response.data]);
        setProductData({
          ProductId: '',
          ProductName: '',
          Categories: [],
          Variations: [],
          Areas: [],
          QuickDeliveryAvailable: false,
          ImgUrls: [],
          Description: '',
        });
        setDefaultImages([]); // Clear default images after adding product
        toast.success('Product Added Successfully');
        console.log(response.data); // Log the response data from the server
        onClose();
      })
      .catch((error) => {
        console.error('Error Adding Product', error);
        toast.error('Failed to add Product');
      });
  };
  
  
  

  

  const handleAddSize = () => {
    if (sizeInput.trim() !== '' && selectedColor && selectedColorCount > 0 && selectedColorPrice && selectedColorImages.length > 0) {
      // Log the size before updating the state
      console.log("Size added:", sizeInput.trim());
      
      // Create a new size object including color name, count, price, and images
      const newSize = {
        size: sizeInput.trim(),
        color: {
          name: selectedColor, // Use selectedColor instead of selectedColorName
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
      setSelectedColor('');
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

  

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    const resizedBase64Image = await resizeAndConvertToBase64(file, 300, 300); // Adjust maxWidth and maxHeight as needed
    console.log("Resized Base64 Encoded Image:", resizedBase64Image);
    // Now you can use the resizedBase64Image for further processing, such as uploading to the server
    setSelectedColorImages((prevImages) => [...prevImages, resizedBase64Image]);
};


  const handleRemoveImage = (index) => {
    const newImages = [...selectedColorImages];
    newImages.splice(index, 1);
    setSelectedColorImages(newImages);
  };

  const handleAddDefaultImage = async (e) => {
    const file = e.target.files[0];
    const resizedBase64Image = await resizeAndConvertToBase64(file, 300, 300); // Adjust maxWidth and maxHeight as needed
    console.log("Resized Base64 Encoded Image:", resizedBase64Image);
    // Now you can use the resizedBase64Image for further processing, such as uploading to the server
    setDefaultImages((prevDefaultImages) => [...prevDefaultImages, resizedBase64Image]);
};
  

  const handleRemoveDefaultImage = (index) => {
    const newImages = [...defaultImages];
    newImages.splice(index, 1);
    setDefaultImages(newImages);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value); // Update the selected option
  };

  const handleAddOption = () => {
    if (selectedOption) {
      setSelectedOptions(prevOptions => [...prevOptions, selectedOption]);
      setSelectedOption(''); // Reset selected option after adding
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(index, 1);
    setSelectedOptions(updatedOptions);
  };

  const getAreas = () => {
    return selectedOptions; // Assuming selectedOptions represent the selected areas
  };

  const handleDescriptionChange = (e) => {
    setProductData({
      ...productData,
      Description: e.target.value,
    });
  };


  const handleVariantChange = (e) => {
    const selectedVariant = e.target.value;
    // Update the product data state based on the selected variant
    setProductData((prevProductData) => ({
      ...prevProductData,
      VariantType: selectedVariant,
    }));
  };


  return (
    <div className="ProductModelContainer">
      <h1>Add Product</h1>
      <form>
        <div className="boxes">

          <div className="mainbox">
            <div>
              <label>1) Product ID:</label>
              <input type="text" className='pid' name="ProductId" value={productData.ProductId || generateProductId()} onChange={handleChange} readOnly/>
            </div>
            <div>
              <label>2 ) Product Name:(*)</label>
              <input required type="text" className='pname' name="ProductName" value={productData.ProductName} onChange={handleChange} />
            </div>
          </div>


          <div className="mainbox">
            <div>
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

          <div className="variantslect">
            <div>
              <label>4) Select Variant Type:</label>
              <select value={productData.VariantType} onChange={handleVariantChange}>
                <option value="">Select Variant Type</option>
                <option value="Many Sizes with Many Colors">Many Sizes with Many Colors</option>
              </select>
            </div>
          </div>

          {productData.VariantType && (
            <div className="manysizemanycolor">
              {/* Render sections dynamically based on selected variant */}
              {productData.VariantType === "Many Sizes with Many Colors" && (
                <div className='mz1'>
                  <label> Many Sizes with Many Colors:</label>
                  <div className='mzdiv'>
                    <label>Add Size:</label>
                    <select
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                      >
                        <option value="">Select Size</option>
                        <option value="Freesize">Freesize</option>
                        {Array.from({ length: 21 }, (_, i) => 30 + i).map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    <label>Select Color:</label>
                      <select
                        value={selectedColor}
                        onChange={handleColorChange}
                      >
                        <option value="">Select Color</option>
                        {colors.map((color, index) => (
                          <option key={index} value={color}>{color}</option>
                        ))}
                      </select>
                    <label>Available Count:</label>
                    <input
                      type="number"
                      value={selectedColorCount}
                      onChange={(e) => setSelectedColorCount(e.target.value)}
                      placeholder="Enter available count"
                    />
                   <label>Price:</label>
                      <input
                        type="text"
                        value={selectedColorPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numeric values or an empty string
                          if (/^\d*\.?\d*$/.test(value) || value === '') {
                            setSelectedColorPrice(value);
                          }
                        }}
                        placeholder="Enter price"
                      />

                    <label>Images:</label>
                    <input type="file" onChange={handleAddImage} accept="image/*" className='imageinput' />
                    {/* Display selected images for the current color */}
                    <div className='imgdiv'>
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
                    <div className='variants'>
                      {productData.Sizes.map((size, index) => (
                        <div key={index} className='size-item'>
                          <span>Size:{size.size}</span>
                          <span>Color Name:{size.color.name}</span>
                          <span>Count: {size.color.count}</span>
                          <span>Price:{size.color.price}</span>
                          <div>
                            {size.color.images.map((image, imgIndex) => (
                              <img key={imgIndex} src={image} alt={`Color Image ${index}-${imgIndex}`} />
                            ))}
                          </div>
                          <button type="button" onClick={() => handleRemoveSize(index)}>Remove</button>
                        </div>
                      ))}
                    </div>


                  
                </div>
              )}
              

            </div>
          )}

          
          <div className="mainbox-areas">
            <div>
              <label>5) Areas:(*)</label>
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

            <div className='selectedareas'>
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


          
          <div className="mainbox--quickdelivary">
            <div className='dilevary'>
              <label>6) Quick Delivery Available:</label>
              <input
                type="checkbox"
                name="QuickDeliveryAvailable"
                checked={productData.QuickDeliveryAvailable}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          


        <div className="mainnbox">
          <div className="desc">
            <label htmlFor="">7) Description</label>
            <textarea name="description" value={productData.Description} onChange={handleDescriptionChange} id=""  rows="10"></textarea>
          </div>    

        </div>
      

          <div className="mmainbox-desc">
            

              <label>8) Default Images:</label>
                <input type="file" className='dfile' onChange={handleAddDefaultImage} accept="image/*" />
                <div className='imagecon'>
                  {defaultImages.map((image, index) => (
                    <div className='imh' key={index}>
                      <img className='dimg' src={image} alt={`Default Image ${index}`} />
                      <button type="button" className='dremove' onClick={() => handleRemoveDefaultImage(index)}>Remove Image</button>
                    </div>
                  ))}
                  
                </div>
                
            
          </div>
          
            
          
        
        </div>
      </form>

      <div className='submitconntainer'>
      <button onClick={handleAddProduct} className='editsave'>Add Product</button>
      </div>

      <ToastContainer/>
    </div>
    
  );
};

export default AddProductModel;
