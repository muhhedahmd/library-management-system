
"use client"
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../store/store';
import { useRef } from 'react';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
        {children}
    </Provider>
  );
}
