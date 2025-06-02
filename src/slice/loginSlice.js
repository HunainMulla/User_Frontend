import {createSlice  } from "@reduxjs/toolkit";

// Check if user is already logged in by looking for token in localStorage
const getInitialLoginState = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Decode JWT token to check expiration (basic check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // If token is expired, remove it and return false
        if (payload.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('guestCart');
            localStorage.removeItem('cart');
            return false;
        }
        
        return true;
    } catch (error) {
        // If token is malformed, remove it and return false
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('guestCart');
        localStorage.removeItem('cart');
        return false;
    }
};

const loginSlice = createSlice({
    name:"login",
    initialState:{
        value: getInitialLoginState()
    },
    reducers:{
        loginUser:(state)=>{
            state.value=true
        },
        logout:(state)=>{
            state.value=false
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('guestCart');
            localStorage.removeItem('cart');
        }        
    }
})

export const {loginUser,logout} = loginSlice.actions
export default loginSlice.reducer