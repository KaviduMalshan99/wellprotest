import api from "./api";

class AuthAPI {
  // User Login
  static login(credentials) {
    return api.post("/api/login", credentials);
  }

  // User Register
  static register(values) {
    return api.post("/api/register", values);
  }

  static fetchCustomers() {
    return api.get("/api/customer");
  }

  // Delete Customer
  static deleteCustomer(userId) {
    return api.delete(`/api/customers/${userId}`);
  }
  
}

export default AuthAPI;
