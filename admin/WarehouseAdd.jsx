import React from "react";
import axios from "axios";
import "./WarehouseAdd.css";

class WarehouseAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      country: "",
      city: "",
      address: "",
      mail: "",
      telNo: "",
      phoneCode: "",  // Initialize phoneCode to an empty string
      phoneMaxLength: 10  // Default maximum length for telephone number
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3001/api/nextId');
      if (response.data && response.data.nextId) {
        this.setState({ id: response.data.nextId });
      } else {
        this.setState({ id: "WH001" }); // Default ID if no ID is fetched
      }
    } catch (error) {
      console.error('Error fetching the next ID:', error);
    }
  }

  countryPhoneDetails = (country) => {
    const details = {
      "Sri Lanka": { code: "+94", maxLength: 9 },
      "India": { code: "+91", maxLength: 10 },
      "China": { code: "+86", maxLength: 11 },
      "USA": { code: "+1", maxLength: 10 },
      "UK": { code: "+44", maxLength: 10 }
    };
    return details[country] || { code: "", maxLength: 10 }; // Default code if country is not matched
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "country") {
      const { code, maxLength } = this.countryPhoneDetails(value);
      this.setState({
        [name]: value,  // Set country and update telNo-related properties
        phoneCode: code,
        phoneMaxLength: maxLength,
        telNo: ""  // Reset the telephone number when the country changes
      });
    } else if (name === "telNo") {
      // Allow only numeric input and enforce the exact length required by the country's phone number specifications
      const regex = new RegExp(`^\\d{0,${this.state.phoneMaxLength}}$`);
      if (regex.test(value)) {
        this.setState({ [name]: value });
      }
    } else {
      this.setState({ [name]: value });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    // Ensure the telephone number is exactly the required length before submitting
    if (this.state.telNo.length !== this.state.phoneMaxLength) {
      alert(`The telephone number must be exactly ${this.state.phoneMaxLength} digits.`);
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/addwarehouse', this.state);
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
                  <input type="text" name="id" className="whainpt" value={this.state.id} readOnly />
                </td>
              </tr>
              <tr>
                <td className="whafl">Country</td>
                <td>
                  <select name="country" className="whainpt" value={this.state.country} onChange={this.handleChange} required>
                    <option value="">Select a country</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="China">China</option>
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
                  <div className="input-group">
                    <span className="input-prefix">{this.state.phoneCode}</span>
                    <input
                      type="text"
                      name="telNo"
                      className="whainpt tel-number"
                      value={this.state.telNo}
                      onChange={this.handleChange}
                      maxLength={this.state.phoneMaxLength}
                      title={`Please enter exactly ${this.state.phoneMaxLength} numeric characters`}
                      required
                    />
                  </div>
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
