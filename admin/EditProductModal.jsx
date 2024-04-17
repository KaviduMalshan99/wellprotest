import { useState ,useEffect} from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import './AddProductModel.css'
import './EditProductModal.css'


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


const EditProductModal = ({ closeModal, product }) => {
   

    console.log('Product:', product); // Log the entire product object
  
    const [editedProduct, setEditedProduct] = useState(product);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedColorName, setSelectedColorName] = useState('');
    const [selectedColorCount, setSelectedColorCount] = useState('');
    const [selectedColorImages, setSelectedColorImages] = useState([]);
    const [sizeCount, setSizeCount] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        if (product && product.ProductId) {
            setEditedProduct(product);
            setSelectedOptions(product.Areas);

            setSelectedImages(product.ImgUrls || []);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({
            ...editedProduct,
            [name]: value
        });
    };

    
      
    
      // Handle checkbox change
      const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditedProduct({
          ...editedProduct,
          [name]: checked
        });
      };
    
      // Handle category selection change
      const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
      };
    
      // Handle adding category
      const handleAddCategory = () => {
        if (selectedCategory) {
          setEditedProduct({
            ...editedProduct,
            Categories: [...editedProduct.Categories, selectedCategory]
          });
          setSelectedCategory('');
        }
      };
    
      // Handle removing category
      const handleRemoveCategory = (categoryToRemove) => {
        const updatedCategories = editedProduct.Categories.filter(category => category !== categoryToRemove);
        setEditedProduct({
          ...editedProduct,
          Categories: updatedCategories
        });
      };
    
      // Handle adding size
      const handleAddSize = () => {
        if (sizeInput.trim() !== '' && sizeCount.trim() !== '') {
          setEditedProduct({
            ...editedProduct,
            Sizes: [...editedProduct.Sizes, { size: sizeInput.trim(), count: sizeCount.trim() }]
          });
          setSizeInput('');
          setSizeCount('');
        }
      };
    
      // Handle removing size
      const handleRemoveSize = (index) => {
        const newSizes = [...editedProduct.Sizes];
        newSizes.splice(index, 1);
        setEditedProduct({
          ...editedProduct,
          Sizes: newSizes
        });
      };
 
      // Handle adding color
      const handleAddColor = () => {
        const newColor = {
          name: selectedColorName,
          count: selectedColorCount,
          images: selectedColorImages // Include selected images in the color object
        };
        setEditedProduct({
          ...editedProduct,
          Colors: [...editedProduct.Colors, newColor]
        });
        setSelectedColorName('');
        setSelectedColorCount('');
        setSelectedColorImages([]); // Clear selected images after adding color
      };
      

    
      // Handle removing color
      const handleRemoveColor = (index) => {
        const newColors = [...editedProduct.Colors];
        newColors.splice(index, 1);
        setEditedProduct({
          ...editedProduct,
          Colors: newColors
        });
      };
    
      const handleColorImageUpload = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          try {
            // Resize and convert the image to base64
            const base64String = await resizeAndConvertToBase64(file, 400, 400);
            // Update the selectedColorImages state with the base64 string
            setSelectedColorImages((prevImages) => [...prevImages, base64String]);
          } catch (error) {
            console.error('Error resizing and converting image:', error);
            // Handle error
          }
        }
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
            // Handle error
          }
        }
      };
      
      
      
      // Handle removing image
      // Handle removing image
      const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
        
        // If the removed image is from previously selected images, update the editedProduct state
        if (index < product.ImgUrls.length) {
          const newImgUrls = [...editedProduct.ImgUrls];
          newImgUrls.splice(index, 1);
          setEditedProduct({
            ...editedProduct,
            ImgUrls: newImgUrls
          });
        }
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


    
      // Handle form submission
      // Handle form submission
      // Handle form submission
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
        {/* Categories */}
        <label>3) Categories:</label>
        <div>
          <label>3) Categories:</label>
          <div className='catdiv'>
            <select value={selectedCategory} onChange={handleCategoryChange} className='cat'>
              {editedProduct.Categories.map((category, index) => (
                <option key={index} value={category}>{category.CatagoryName}</option>
              ))}
            </select> 
            <button className='catbtn' type="button" onClick={handleAddCategory}>Add Category</button>
          </div>
        </div>

        </div>
        </div>
        
        <div className="mainbox">
        <div>
        {/* Display selected categories */}
        <label> Selected Categories:</label>
        <ul>
        {editedProduct.Categories.map((category, index) => (
            <li key={index}>
                {category.CatagoryName} ( {category.CatagoryName})
                <button type="button" onClick={() => handleRemoveCategory(category)}>Remove</button>
            </li>
        ))}


        </ul>
        </div>
        </div>

        

        <div className="mainbox">
        <div>
        <label>4) Price:</label>
        <input type="text" className='pprice' name="Price" value={editedProduct.Price} onChange={handleChange} />
        </div>
        </div>

        
        <div className="mainbox">
        <div>
        <label>5) Quick Delivery Available:</label>
        <input type="checkbox" name="QuickDeliveryAvailable" checked={editedProduct.QuickDeliveryAvailable} onChange={handleCheckboxChange} />
        </div>
        </div>

        <div className="mainbox">
          <div className="sizes">
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
              {editedProduct.Sizes.map((size, index) => (
                <div key={index} className='size-item'>
                  <span>{"size : "+size.size}</span>
                  <span>{" Count : "+size.count}</span>
                  <button type="button" onClick={() => handleRemoveSize(index)}>Remove</button>
                </div>
              ))}
            </div>

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
              <input type="text" value={selectedColorName} onChange={(e) => setSelectedColorName(e.target.value)} placeholder="Enter Color Name"/>
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
              <input type="file" className='fileselect' onChange={handleColorImageUpload} multiple accept="image/*" />
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
          
          
          {editedProduct.Colors.map((color, index) => (
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
        
        <div className="last">
        <button type="button" onClick={closeModal} className='EDTcancel'>Close</button>
        <button type="submit">Save Changes</button>
        </div>


        </div>
        
      </form>
      <ToastContainer/>
    </div>
  );
};

export default EditProductModal;
