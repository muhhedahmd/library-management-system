"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteUser, setUser } from "@/store/Reducers/MainUserSlice";
import { userResponse } from "@/store/Reducers/MainUserSlice";
import type { UserData } from "@/Types";

const UserSessionManager = () => {
  const { data } = useSession();
  const sessionUser = data?.user as UserData | undefined;
  const dispatch = useDispatch();
  const cachedUser = useSelector((state: RootState) => userResponse(state));

  useEffect(() => {
    if (sessionUser && !cachedUser) {
      dispatch(setUser(sessionUser));
    } else if (!sessionUser && cachedUser) {
      dispatch(deleteUser());
    }
  }, [sessionUser, cachedUser, dispatch]);

  return null;
};

export default UserSessionManager;