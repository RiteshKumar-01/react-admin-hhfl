import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "loggedin",
    initialState: {jwtToken: null, userDetails: null},
    reducers: {
        updateToken (state, action) {
            state.jwtToken = (action.payload);
            //console.log('added', action.payload);
        },
        updateUserDetails (state, action) {
            state.userDetails = (action.payload);
            //console.log('added', action.payload);
        },
        clearUsers (state, action) {
            console.log('delete');
            return {
                jwtToken:null,
                userDetails: null
            }
        }
    },
});

export default userSlice.reducer;
export const {updateToken, updateUserDetails, clearUsers} = userSlice.actions;