import  { useState, useEffect } from 'react';
import './AddProductModel.css';
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
  const [categories, setCategories] = useState([]);
  const [selectedColorCount, setSelectedColorCount] = useState(0);
  const [selectedColorImages, setSelectedColorImages] = useState([]); // Images for selected color
  const [defaultImages, setDefaultImages] = useState([]); // Default images
  const [sizeInput, setSizeInput] = useState('');
  const [selectedColorName, setSelectedColorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sizeCount, setSizeCount] = useState(0);
  const [priceError, setPriceError] = useState('');


  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/categories')
      .then((response) => {
        
        setCategories(response.data.response);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

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
  

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update the selected category
  };

  const handleAddCategory = () => {
    if (selectedCategory) {
      const categoryName = getCategoryNameById(selectedCategory);

      setProductData({
        ...productData,
        Categories: [...productData.Categories, selectedCategory],
      });
      setSelectedCategory('');
      console.log("Selected Categories:", categoryName);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProductData({
      ...productData,
      [name]: checked,
    });
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = productData.Categories.filter((category) => category !== categoryToRemove);
    setProductData({
      ...productData,
      Categories: updatedCategories,
    });
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((category) => category._id === categoryId);
    return category ? category.CatagoryName : '';
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

  const handleAddProduct = async () => {
    const productId = generateProductId();

    const categoryName = getCategoryNameById(selectedCategory);
  
    // Set the generated product ID in the productData state
    setProductData(prevProductData => ({
      ...prevProductData,
      ProductId: productId,
      Categories: [...prevProductData.Categories, categoryName]
    }));
  
    const updatedProductData = {
      ...productData,
      ProductId: productId,
      ImgUrls: [...productData.ImgUrls, ...defaultImages, ...selectedColorImages],
      AvailableCount: getAvailableCount(),
      Areas: getAreas(),
      Description: productData.Description,
    };
  
    updatedProductData.Description = productData.Description;
    console.log('Description:', updatedProductData.Description);

    
    axios
      .post('http://localhost:3001/api/addproduct', updatedProductData)
      .then((response) => {
        setProducts((prevProducts) => [...prevProducts, response.data]);
        setProductData({
          ProductId: '',
          ProductName: '',
          Categories: [],
          Price: '',
          Areas: [],
          Sizes: [],
          Colors: [],
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
  
  

  const handleAddColor = () => {
    if (selectedColorName && selectedColorImages.length > 0 && selectedColorCount > 0) { // Check if all required fields are filled
      setProductData({
        ...productData,
        Colors: [
          ...productData.Colors,
          { name: selectedColorName, count: selectedColorCount, images: selectedColorImages } // Include count in the color object
        ],
      });
      setSelectedColorName(''); // Reset selected color name after adding
      setSelectedColorImages([]); // Reset selected color images after adding
      setSelectedColorCount(0); // Reset selected color count after adding
    } else {
      // Display an error message or take appropriate action if any required field is missing
      console.error("Please select a color name, enter available count, and select at least one image.");
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

  const handleAddSize = () => {
    if (sizeInput.trim() !== '' && sizeCount > 0) {
      setProductData({
        ...productData,
        Sizes: [...productData.Sizes, { size: sizeInput.trim(), count: sizeCount }], // Include count for each size
      });
      setSizeInput(''); // Clear the size input field
      setSizeCount(0); // Clear the count input field
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
              <label>2 ) Product Name:</label>
              <input type="text" className='pname' name="ProductName" value={productData.ProductName} onChange={handleChange} />
            </div>
          </div>

          <div className="mainbox">

            <div>
              <label>3) Categories:</label>
              <div className='catdiv'>
              <select value={selectedCategory} onChange={handleCategoryChange} >
                <option value="" className='optcat'>Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.CatagoryName}</option>
                ))}
              </select> 
              <button className='catbtn' type="button" onClick={handleAddCategory}>Add Category</button>
              </div>
            </div>

            <div className='selectedclass'>
              {/* Display selected categories */}
              
              <ul>
                {productData.Categories.map((categoryId, index) => (
                  <li key={index}>
                    {getCategoryNameById(categoryId)}
                    <button type="button" onClick={() => handleRemoveCategory(categoryId)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          

          <div className="mainbox">
            <div>
              <label>4) Price:</label>
              <input type="text" className='pprice' name="Price" value={productData.Price} onChange={handleChange} />
              {priceError && <p className="error-message" style={{ color: 'red' }}>{priceError}</p>}

            </div>
            
          </div>


          
          <div className="mainbox">
            <div className='dilevary'>
              <label>5) Quick Delivery Available:</label>
              <input
                type="checkbox"
                name="QuickDeliveryAvailable"
                checked={productData.QuickDeliveryAvailable}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
          



          <div className="mainbox">
            <div className='sd1'>
            <label>6) Sizes:</label>
            <div className='dd1'>
              <label htmlFor="">Add Size : </label>
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Enter size"
              />
            </div>

            <div className='dd2'>
              <label htmlFor="">Add Count :</label>
              <input
                type="number"
                value={sizeCount}
                onChange={(e) => setSizeCount(e.target.value)}
                placeholder="Enter count"
              />
            </div>
              
              
              <button type="button" className='sizeaddbtn' onClick={handleAddSize}>Add Size</button>
            </div>

            <div className='sd2'>
                {productData.Sizes.map((size, index) => (
                  <div key={index} className='size-item'>
                    <span>{size.size}</span>
                    <span>{size.count}</span>
                    <button type="button" onClick={() => handleRemoveSize(index)}>Remove</button>
                  </div>
                ))}
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

          
          <div className="mainbox">
            
            
              <div className="color-section">
              <label className='colorlable' >8) Color Section</label>
              <div>
                <label>Color Name:</label>
                <input type="text" value={selectedColorName} onChange={(e) => setSelectedColorName(e.target.value)} />
              </div>
              <div>
                <label>Available Count:</label>
                <input
                  type="number"
                  value={selectedColorCount}
                  onChange={(e) => setSelectedColorCount(e.target.value)}
                  placeholder="Enter available count"
                />
              </div>
              <div>
                <input type="file" className='fileselect' onChange={handleAddImage} multiple accept="image/*" />
              </div>
              {/* Display selected images for the current color */}
              <div className="selected-images">
                {selectedColorImages.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Color Image ${index}`} />
                    <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                  </div>
                ))}
              </div>
              <button type="button" className='addp' onClick={handleAddColor}>Add Color</button>
            </div>
            
            
            {productData.Colors.map((color, index) => (
              <div key={index} className="color-section">
                <div>
                  <label>Color Name: {color.name}</label> {/* Display the color name */}
                  <label>Available Count: {color.count}</label> {/* Display the available count */}
                </div>
                <div className="selected-images">
                  {color.images.map((image, idx) => (
                    <div key={idx}>
                      <img src={image} alt={`Color Image ${idx}`} />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => handleRemoveColor(index)}>Remove Color</button>
              </div>
            ))}
      
        </div>

        <div className="mainnbox">
          <div className="desc">
            <label htmlFor="">9) Description</label>
            <textarea name="description" value={productData.Description} onChange={handleDescriptionChange} id=""  rows="10"></textarea>
          </div>    

        </div>
      

          <div className="mainbox">
            <div className='default'>

              <label>10) Default Images:</label>
                <div>
                  {defaultImages.map((image, index) => (
                    <div key={index}>
                      <img className='dimg' src={image} alt={`Default Image ${index}`} />
                      <button type="button" className='dremove' onClick={() => handleRemoveDefaultImage(index)}>Remove Image</button>
                    </div>
                  ))}
                  <input type="file" className='dfile' onChange={handleAddDefaultImage} accept="image/*" />
                </div>

            </div>
          </div>
          
            
          
        
        </div>
      </form>

      <div className='submitconntainer'>
      <button onClick={handleAddProduct} className='submitbtn'>Add Product</button>
      </div>

      <ToastContainer/>
    </div>
    
  );
};

export default AddProductModel;
