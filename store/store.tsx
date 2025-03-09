
// Create the store instance
import { createWrapper } from 'next-redux-wrapper'; // Optional if using with Next.js
import { configureStore } from '@reduxjs/toolkit';
import { mainUserSlice } from './Reducers/MainUserSlice';
import { apiUser } from './QueriesApi/ProfileQuery';
import { apiAuthor } from './QueriesApi/authorApi';
import { apiCategory } from './QueriesApi/categoryApi';
import { apiPublisher } from './QueriesApi/publisherApi';
import paggnitionSlice from "./Slices/paggnitionSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      mainUserSlice :mainUserSlice.reducer,
      [apiUser.reducerPath] : apiUser.reducer,
      [apiAuthor.reducerPath] : apiAuthor.reducer,
      [apiCategory.reducerPath] : apiCategory.reducer,
      [apiPublisher.reducerPath] : apiPublisher.reducer,
      pagination :paggnitionSlice,


      // [apiSlice.reducerPath] : apiSlice.reducer ,
     
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(

    )
    .concat(apiUser.middleware)
    .concat(apiAuthor.middleware)
    .concat(apiCategory.middleware)
    .concat(apiPublisher.middleware)

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