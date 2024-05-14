import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
// import emailjs from 'emailjs-com';
import "./WarehouseInven.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WarehouseInvDetails() {
  const [stocks, setStocks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("productId");
  const [filteredInventory, setFilteredInventory] = useState([]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/stocks/${id}`);
      setStocks(response.data);
      setInventory(response.data); // Update inventory state
    } catch (error) {
      console.error('Failed to fetch stocks', error);
    }
  };

  useEffect(() => {
    stocks.forEach((stock, index) => {
      const progressBar = document.getElementById(`progress-${stock.id}-${index}`);
      if (progressBar) {
        const maxQuantity = 60; // Assuming the full stock capacity is 60
        const percentage = Math.min((stock.stockquantity / maxQuantity) * 100, 100);
        progressBar.style.width = `${percentage}%`;

        // Update backgroundColor based on the percentage
        if (percentage < 25) {
          progressBar.style.backgroundColor = "#ff0000";  // Red for less than 25%
        } else if (percentage < 50) {
          progressBar.style.backgroundColor = "#ff6600";  // Orange for less than 50%
        } else if (percentage < 75) {
          progressBar.style.backgroundColor = "#ffff00";  // Yellow for less than 75%
        } else {
          progressBar.style.backgroundColor = "#00ff00";  // Green for 75% and above
        }

        // Send an email notification if stock quantity is less than 25% of max capacity
        const threshold = maxQuantity * 0.25;
        if (stock.stockquantity < threshold) {
          // sendNotificationEmail(stock.productId, stock.stockquantity);
          sendNotification(stock.productId, stock.stockquantity, stock.productName, stock.sizes, stock.colors);
        }

        // Display a toast message if the stock exceeds the maxQuantity
        if (stock.stockquantity > maxQuantity) {
          toast.warning(`Stock quantity for Product ID: ${stock.productId} exceeds the limit!`);
        } else if (stock.stockquantity < maxQuantity) {
          // Calculate the quantity needed to reach the maximum
          const quantityNeeded = maxQuantity - stock.stockquantity;
          toast.info(`Please add ${quantityNeeded} to the quantity of Product ID: ${stock.productId} to reach the full capacity.`);
        }
      }
    });
  }, [stocks]);

  const sendNotification = (productId, stockQty, productName, sizes, colors) => {
    const notificationData = {
      warehouseId: id,
      productId,
      stockQty,
      productName,
      sizes,
      colors,
      message: `Product ID: ${productId}, product-Name:${productName}, product-size: ${sizes}, product-color: ${colors}, Warehouse ID: ${id} => has low stock: ${stockQty} items left!`
    };

    // Post the notification data to the backend
    axios.post('http://localhost:3001/api/notifications', notificationData)
      .then(response => console.log('Notification sent!', response.status, response.data))
      .catch(error => {
        console.error('Failed to send notification', error);
        if (error.response) {
          // If there's a response from the server, print the message
          console.error('Error response data:', error.response.data);
        } else {
          console.error('No response received:', error.message);
        }
      });
  };



  //const sendNotificationEmail = (id, amount) => {
  // Add your EmailJS credentials and parameter details
  //emailjs.send("service_smyt8zd", "template_n96sx1q", {
  // product_id: id,
  // stock_level: amount,
  // to_name: "Warehouse Manager",
  // to_email: "wellwornsl@gmail.com",
  // }, "b_3EbwZJHsdFLGsRI")
  //.then(response => console.log('Email successfully sent!', response.status, response.text))
  // .catch(error => console.error('Failed to send email.', error));
  //};

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item[filterBy].toString().toLowerCase().includes(searchTerm)
    );
    setFilteredInventory(filtered);
  }, [searchTerm, filterBy, inventory]);

  const generatePDF = () => {
    const input = document.getElementById('pdf-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.text(`Inventory Report - Warehouse ID: ${id}`, 10, 10); // Add the warehouse ID
      pdf.text("Inventory Report", 10, 30); // Add the heading "Inventory Report"

      pdf.addImage(imgData, 'PNG', 0, position + 15, imgWidth, imgHeight); // Adjust position for the table content
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.setFontSize(9); // Set font size to 8
      pdf.text("Generated by WellWorn Inventory", 10, pageHeight - 10);

      pdf.save('Inventories.pdf');
    });
  };

  return (
    <div className="whinm">
      <ToastContainer />
      <div className="wheinmt">
        <div className="whinmtit">WAREHOUSE SECTION
          <Link to="/admin/warehouse" className="whinbkbtn1">Warehouses</Link><Link to="/admin/current-stock" className="whinbkbtn1">Current Stock</Link>
        </div>
      </div>
      <div className="whintitle">Inventory Details {id}</div>
      <div className="filter-container">
        <select className="whinsrch" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="productId">ProductID</option>
          <option value="productName">Product Name</option>
          <option value="sizes">ProductSize</option>
          <option value="colors">ProductColor</option>
          <option value="stockquantity">Quantity</option>
        </select>
        <input
          type="text"
          className="whinsrch"
          placeholder={`Search by ${filterBy}...`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={generatePDF} className="whinbkbtn">
          Generate PDF
        </button>
      </div>
      <table id="pdf-table" className="Waresuportab">
        <thead>
          <tr>
            <th>ProductID</th>
            <th>Product Name</th>
            <th>Product Size</th>
            <th>Product Color</th>
            <th>Stock Level</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((stock, index) => (
            <tr key={index}>
              <td>{stock.productId}</td>
              <td>{stock.productName}</td>
              <td>{stock.sizes.join(', ')}</td>
              <td>{stock.colors.join(', ')}</td>
              <td>
                <div className="progress">
                  <div id={`progress-${stock.id}-${index}`} className="progress-bar"></div>
                </div>
                {stock.stockquantity}/60
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarehouseInvDetails;
