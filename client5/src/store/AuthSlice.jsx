import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  error: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "admin/register",
  async ({ name, email, password, role, storeName }, { rejectWithValue }) => {
    try {
      console.log(" Sending registration data:", { name, email, password, role, storeName });

      const response = await axios.post(
        "http://localhost:2500/api/admin/register",
        { name, email, password, role, storeName },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(" Registration successful:", response.data);

      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(" Registration failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);



export const loginUser = createAsyncThunk(
  "admin/login",
  async ({ name, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:2500/api/admin/login",
        { name, password }
      );
      localStorage.setItem("user", JSON.stringify(data)); // Store user data (token)
      return data; // Return the response object which will be used in the Redux state
    } catch (error) {
      return rejectWithValue(error.response.data.message); // Reject with error message
    }
  }
);


// Logout User
export const logoutUser = createAsyncThunk(
  "admin/logout",
  async () => {
    localStorage.removeItem("user");
    return null;
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        "http://localhost:2500/api/admin/update-profile",
        { name, email }
      );
      localStorage.setItem("user", JSON.stringify(data)); // Optionally update localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Handle profile update
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Update the user state with the new profile data
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
