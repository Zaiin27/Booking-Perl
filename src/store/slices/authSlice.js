import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/Api";
import { BASE_URL } from "../../services/ApiEndpoints";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  userDetails: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.userDetails = null;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, token: action.payload.token };
        state.isAuthenticated = true;
        state.error = null;
        
        // Save token to localStorage for persistence
        if (action.payload.token) {
          localStorage.setItem('auth_token', action.payload.token);
          localStorage.setItem('user_data', JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.userDetails = null;
        
        // Clear localStorage on logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setLoading, setError, setUser, clearUser, setUserDetails } =
  authSlice.actions;

// Async thunks using RTK Query
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      console.log("Login thunk: Starting login with credentials:", credentials);
      console.log(
        "Login thunk: BASE_URL:",
        import.meta.env.VITE_API_URL ||
          (import.meta.env.DEV ? "" : "https://meb.senew-tech.com")
      );
      console.log("Login thunk: API endpoint:", "/api/v1/auth/signin");

      const result = await dispatch(api.endpoints.login.initiate(credentials));
      console.log("Login thunk: API result:", result);
      console.log("Login thunk: Result data:", result.data);
      console.log("Login thunk: Result error:", result.error);

      if (result.data) {
        console.log("Login thunk: Success - raw data:", result.data);
        // Normalize varying API shapes into a consistent structure
        const raw = result.data;
        const token =
          raw.token ||
          raw.accessToken ||
          raw.jwt ||
          raw.data?.token ||
          raw.data?.accessToken ||
          raw.data?.jwt;
        const user = raw.user || raw.data?.user || raw.data || raw.profile || null;
        const normalized = { user, token };
        console.log("Login thunk: Normalized payload:", normalized);
        return normalized;
      } else if (result.error) {
        console.log("Login thunk: API error details:", result.error);
        console.log("Login thunk: Error status:", result.error.status);
        console.log("Login thunk: Error data:", result.error.data);
        // Extract message from error data if it's an object
        let errorMessage = "Login failed";
        if (result.error.data) {
          if (typeof result.error.data === 'object' && result.error.data.message) {
            errorMessage = result.error.data.message;
          } else if (typeof result.error.data === 'string') {
            errorMessage = result.error.data;
          }
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else {
        console.log("Login thunk: No data but no error");
        toast.error("Login failed");
        return rejectWithValue("Login failed");
      }
    } catch (error) {
      console.log("Login thunk: Catch error:", error);
      toast.error("Network error. Please check your connection and try again.");
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log("Logout thunk: Initiating logout API call...");
      
      const result = await dispatch(api.endpoints.logout.initiate());
      console.log("Logout thunk: API result:", result);

      // Check if the request was successful
      if (result.data) {
        console.log("Logout thunk: Success with data");
        toast.success("Logged out successfully!");
        return { success: true };
      }

      // Check if the request was fulfilled (even without data)
      if (result.meta?.requestStatus === "fulfilled") {
        console.log("Logout thunk: Success - request fulfilled");
        toast.success("Logged out successfully!");
        return { success: true };
      }

      // Check for errors
      if (result.error) {
        console.log("Logout thunk: API error:", result.error);
        console.log("Logout thunk: Error status:", result.error.status);
        console.log("Logout thunk: Error data:", result.error.data);

        // Handle 404 error gracefully - endpoint might not exist
        if (
          result.error.status === 404 ||
          result.error.status === "FETCH_ERROR"
        ) {
          console.log(
            "Logout thunk: 404 or FETCH_ERROR - endpoint not found, treating as success"
          );
          toast.success("Logged out successfully!");
          return { success: true };
        }

        // For other errors, still treat as success since we want to clear local state
        console.log(
          "Logout thunk: Other error, but treating as success to clear local state"
        );
        toast.success("Logged out successfully!");
        return { success: true };
      }

      // If we get here, treat as success
      console.log("Logout thunk: No clear result, treating as success");
      toast.success("Logged out successfully!");
      return { success: true };
    } catch (error) {
      console.log("Logout thunk: Catch error:", error);
      // Even if there's an exception, we should clear local state
      toast.success("Logged out successfully!");
      return { success: true };
    }
  }
);

// Thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      console.log("Signup thunk: Initiating signup API call...");
      console.log("Signup thunk: User data:", userData);
      console.log("Signup thunk: User data keys:", Object.keys(userData));
      console.log("Signup thunk: User data values:", Object.values(userData));
      console.log("Signup thunk: BASE_URL:", BASE_URL);
      console.log("Signup thunk: API endpoint:", "/api/v1/auth/signup");
      
      const result = await dispatch(api.endpoints.register.initiate(userData));
      console.log("Signup thunk: API result:", result);
      console.log("Signup thunk: Result data:", result.data);
      console.log("Signup thunk: Result error:", result.error);
      console.log("Signup thunk: Result meta:", result.meta);

      if (result.data) {
        console.log("Signup thunk: Success");
        // Handle the actual API response structure
        const userData = result.data.data || result.data.user || result.data;
        toast.success(
          result.data.message ||
            "Account created successfully! Please check your email for verification."
        );
        return { success: true, user: userData, message: result.data.message };
      } else if (result.error) {
        console.log("Signup thunk: API error details:", result.error);
        console.log("Signup thunk: Error status:", result.error.status);
        console.log("Signup thunk: Error data:", result.error.data);

        // Handle specific error types
        let errorMessage = "Signup failed";
        
        if (result.error.status === 'FETCH_ERROR') {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (result.error.data) {
          if (typeof result.error.data === "string") {
            errorMessage = result.error.data;
          } else if (result.error.data.message) {
            errorMessage = result.error.data.message;
          } else if (result.error.data.error) {
            errorMessage = result.error.data.error;
          }
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }

        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else {
        console.log("Signup thunk: No data but no error");
        toast.error("Signup failed - no response data");
        return rejectWithValue("Signup failed - no response data");
      }
    } catch (error) {
      console.log("Signup thunk: Catch error:", error);
      console.log("Signup thunk: Error type:", error.constructor.name);
      console.log("Signup thunk: Error message:", error.message);
      
      let errorMessage = "Network error. Please check your connection and try again.";
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
      } else if (error.message.includes('CORS')) {
        errorMessage = "CORS error. Please check your server configuration.";
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for getting user by ID
export const getUserById = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUserDetails = {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      profilePicture: "https://example.com/profile.jpg",
    };

    dispatch(setUserDetails(mockUserDetails));

    return { success: true, userDetails: mockUserDetails };
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user data"
      )
    );
    return { success: false, error: error.message };
  }
};

// Thunk for updating user profile
export const updateUser = (userData) => async (dispatch, getState) => {
  const formData = new FormData();

  // Append all user data fields to FormData
  Object.keys(userData).forEach((key) => {
    if (key === "profileImage" && userData[key]) {
      formData.append("profileImage", userData[key]);
    } else if (userData[key] !== undefined && userData[key] !== null) {
      formData.append(key, userData[key]);
    }
  });

  try {
    dispatch(setLoading(true));

    const { data } = await api.put(`/api/auth/editUser`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Update both user and userDetails in the state
    dispatch(setUser({ ...data.data, token: getState().auth?.user?.token }));
    dispatch(setUserDetails(data.data));

    toast.success("Profile updated successfully!");

    return { success: true, user: data.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile";

    toast.error(errorMessage);
    dispatch(setError(errorMessage));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
