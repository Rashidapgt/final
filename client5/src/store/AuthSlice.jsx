import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let user = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user = JSON.parse(storedUser);
    // Optionally check for a valid user object structure
    if (!user || !user.email) {
      user = null;
    }
  }
} catch (error) {
  console.error("Error parsing user data from localStorage", error);
}

const initialState = {
  user: user,
  isLoading: false,
  error: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "admin/register",
  async ({ name, email, password, role, storeName }, { rejectWithValue }) => {
    try {
      console.log("Sending registration data:", { name, email, password, role, storeName });

      const response = await axios.post(
        "http://localhost:2500/api/admin/register",
        { name, email, password, role, storeName },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Registration successful:", response.data);

      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      // Catch user already exists error
      if (error.response && error.response.data.message === "User already exists") {
        return rejectWithValue("User already exists. Please try logging in.");
      }
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

/// Login User
export const loginUser = createAsyncThunk(
  "auth/login", // changed the action name to 'auth/login' for consistency
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:2500/api/admin/login", { email, password }); // Ensure the correct endpoint

      // Store both user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      return data; // Return user and token to Redux store
    } catch (error) {
      // Handle errors more gracefully and provide more informative feedback
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      return rejectWithValue(errorMessage);
    }
  }
);


// Logout User
export const logoutUser = createAsyncThunk(
  "admin/logout",
  async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:2500/api/admin/update-profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
  }
);

// Get User Profile
export const getVendorProfiles = createAsyncThunk(
  "auth/getVendorProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const { data } = await axios.get(
        "http://localhost:2500/api/profile/vendors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update localStorage with fresh user data
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return rejectWithValue("Session expired. Please login again.");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
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
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getVendorProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVendorProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getVendorProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        if (action.payload === "Session expired. Please login again.") {
          state.user = null;
        }
      });
  },
});

export default authSlice.reducer;