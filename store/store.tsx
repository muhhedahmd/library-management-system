
// Create the store instance
import { createWrapper } from 'next-redux-wrapper'; // Optional if using with Next.js
import { configureStore } from '@reduxjs/toolkit';
import { mainUserSlice } from './Reducers/MainUserSlice';
import { apiUser } from './QueriesApi/ProfileQuery';

export const makeStore = () => {
  return configureStore({
    reducer: {
      mainUserSlice :mainUserSlice.reducer,
      [apiUser.reducerPath] : apiUser.reducer,

      // [apiSlice.reducerPath] : apiSlice.reducer ,
     
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(

    )
    .concat(apiUser.middleware)

    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serializableCheck({
    //   ignoredActions: ['persist/PERSIST'], // ignore the PERSIST action
    // })),
  
  
  });
};

const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const wrapper = createWrapper<AppStore>(makeStore);