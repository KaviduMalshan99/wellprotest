import React from "react";
import axios from "axios";
import "./WarehouseAdd.css";

class WarehouseAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      country: "", // Update the initial value of country to an empty string
      city: "",
      address: "",
      mail: "",
      telNo: ""
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3001/api/nextId'); // Adjust the URL if needed based on your actual API setup.
      if (response.data && response.data.nextId) {
        this.setState({ id: response.data.nextId });
      } else {
        // If no warehouses exist, start with WH001
        this.setState({ id: "WH001" });
      }
    } catch (error) {
      console.error('Error fetching the next ID:', error);
    }
  }
  

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the form data to the backend to add the warehouse
      const response = await axios.post('http://localhost:3001/api/addwarehouse', {
        ...this.state, // Include all state properties in the request
      });
      console.log(response.data);
      alert('Warehouse added successfully');
      
    } catch (error) {
      console.error('Error adding warehouse:', error);
      alert('Failed to add warehouse');
    }
  }

  render() {
    return (
      <div className="whadm">
        <div className="whamt">WAREHOUSE SECTION</div>
        <div className="whadtxt">Add Details</div>
        <form onSubmit={this.handleSubmit} className="whmcon">
          <table className="whadf">
            <tbody>
              <tr>
                <td className="whafl">ID</td>
                <td>
                  {/* Display the ID fetched from the backend */}
                  <input type="text" name="id" className="whainpt" value={this.state.id} readOnly />
                </td>
              </tr>
              <tr>
                <td className="whafl">Country</td>
                <td>
                  {/* Dropdown for country selection */}
                  <select 
                    name="country" 
                    className="whainpt" 
                    value={this.state.country} 
                    onChange={this.handleChange} 
                    required
                  >
                    <option value="">Select a country</option>
                    <option value = "Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value = "China">China</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>

                    
                  </select>
                </td>
              </tr>
              <tr>
                <td className="whafl">City</td>
                <td>
                  <input type="text" name="city" className="whainpt" value={this.state.city} onChange={this.handleChange} required />
                </td>
              </tr>
              <tr>
                <td className="whafl">Address</td>
                <td>
                  <input type="text" name="address" className="whainpt" value={this.state.address} onChange={this.handleChange} required />
                </td>
              </tr>
              <tr>
                <td className="whafl">Mail</td>
                <td>
                  <input type="email" name="mail" className="whainpt" value={this.state.mail} onChange={this.handleChange} required />
                </td>
              </tr>
              <tr>
                <td className="whafl">Tel No</td>
                <td>
                  <input 
                    type="text" 
                    name="telNo" 
                    className="whainpt" 
                    value={this.state.telNo} 
                    onChange={this.handleChange} 
                    pattern="[0-9]*" 
                    title="Please enter only numeric characters" 
                    required 
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" className="whbbtn">Save</button>
        </form>
      </div>
    );
  }
}

export default WarehouseAdd;
