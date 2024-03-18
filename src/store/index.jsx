import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/UserSlice";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
//import { getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
   key: 'root',
   //storage,
   storage:storageSession,
 }


 let rootReducer = combineReducers({
   loggedin: userSlice,
 })

 const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
   // reducer:{
   //    loggedin: userSlice,
   // },
   reducer: persistedReducer,
   middleware: getDefaultMiddleware =>
   getDefaultMiddleware({
     serializableCheck: false,
   }),
});

export default store;