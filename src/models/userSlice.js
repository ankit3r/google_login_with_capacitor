import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { Capacitor } from '@capacitor/core';

// Check if running on native platform
const isNative = Capacitor.isNativePlatform();

// Conditionally import FirebaseAuthentication only for native
let FirebaseAuthentication;
if (isNative) {
  FirebaseAuthentication = require('@capacitor-firebase/authentication').FirebaseAuthentication;
}

// Check current auth state on app start
export const checkAuthState = createAsyncThunk(
  'user/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      if (isNative && FirebaseAuthentication) {
        // Native: Get current user from Capacitor plugin
        try {
          const result = await FirebaseAuthentication.getCurrentUser();
          console.log('Native: Current user:', result);
          if (result && result.user) {
            return {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoUrl,
            };
          }
          return null;
        } catch (error) {
          console.log('Native: No user signed in');
          return null;
        }
      } else {
        // Web: Use Firebase JS SDK
        return new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, 
            (firebaseUser) => {
              unsubscribe();
              if (firebaseUser) {
                console.log('Web: User found:', firebaseUser.email);
                resolve({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                });
              } else {
                console.log('Web: No user found');
                resolve(null);
              }
            },
            (error) => {
              unsubscribe();
              reject(error);
            }
          );
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google login (works on both web and native)
export const loginWithGoogle = createAsyncThunk(
  'user/loginGoogle',
  async (_, { rejectWithValue }) => {
    try {
      let result;
      
      if (isNative && FirebaseAuthentication) {
        // Native: Use Capacitor Firebase Authentication
        console.log('Native: Starting Google Sign-In...');
        result = await FirebaseAuthentication.signInWithGoogle();
        console.log('Native: Sign-in result:', result);
        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoUrl,
        };
      } else {
        // Web: Use Firebase JS SDK
        console.log('Web: Starting Google Sign-In...');
        result = await signInWithPopup(auth, googleProvider);
        console.log('Web: Sign-in result:', result.user);
        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    if (isNative && FirebaseAuthentication) {
      console.log('Native: Signing out...');
      await FirebaseAuthentication.signOut();
    } else {
      console.log('Web: Signing out...');
      await signOut(auth);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth state
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log('Auth state loaded:', action.payload);
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.error('Auth check failed:', action.payload);
      })
      // Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log('Login successful:', action.payload);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        console.log('Logout successful');
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
