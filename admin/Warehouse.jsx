import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from '@mui/material';
import WarehouseAdd from '../admin/WarehouseAdd';
import "./Warehouse.css";  // Ensure the CSS path is correct
import { useNavigate } from 'react-router-dom';


const WarehouseSection = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const response = await fetch("http://localhost:3001/api/warehouse");
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data);
      } else {
        console.error("Failed to fetch warehouses");
      }
    };

    fetchWarehouses();
  }, []);

  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);
  

  const navigate = useNavigate(); // Initializing navigate function

  const handleClick = () => {
    // Redirect to the Refund page when the button is clicked
    navigate('/warehouseorders');
    
  };
  const handleOrdersTableClick = () => {
    // Redirect to the Refund page when the button is clicked
    navigate('/orderstable');
  };

  const handleWarehouseInvenClick = () => {
    // Redirect to the Refund page when the button is clicked
    navigate('/current-stock');
  };

  const handleWarehouseEditClick = () => {
    // Redirect to the Refund page when the button is clicked
    navigate('/edit-warehouse/${warehouse.id}');
  };

  return (
    <div className="wmain">
      <div className="wmtitlee">Warehouse Section</div>
      <div className="waddbtnplc">
        <button type='button' className='waaddbtn' onClick={toggleAddModal}>
          <i className="fas fa-plus"></i>Add New Warehouse
        </button>
        <Modal open={isAddModalOpen} onClose={toggleAddModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{justifyContent:'center', width: '80%', maxWidth: '1000px', borderRadius:'10px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#cfd2d2', padding: '20px' }}>
            <WarehouseAdd onClose={toggleAddModal} />
          </div>
        </Modal>
      </div>
      <div className="wraebtnset">
      <div className="waddbtnplc">
        <Link to="/orderstable" className="waaddbtn">
          Orders
        </Link>
      </div>
      <div className="waddbtnplc">
        <Link to="/warehouseorders" className="waaddbtn">
          New Stocks
        </Link></div>
      <div className="waddbtnplc">
        <Link to="/current-stock" className="waaddbtn">
          Current Stocks
        </Link>
      </div>
      </div>
      
      <div className="exwhtitle">Existing Warehouses</div>
      <center>
        <table className="whtd">
          <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(warehouse => (
              <tr className="whvtr" key={warehouse.id}>
                <td className="whvtd">{warehouse.id}</td>
                <td className="whvtd">{warehouse.country}</td>
                
                <td className="whvtd">
                  <Link to={`/edit-warehouse/${warehouse.id}`} className="waaddbtn">
                    Edit
                  </Link>
                  {" | "}
                  <Link to={`/warehouse-details/${warehouse.id}`} className="waaddbtn">
                    View More
                  </Link>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
};

export default WarehouseSection;
