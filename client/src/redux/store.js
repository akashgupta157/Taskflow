import authReducer from "./Slice/authSlice";
import projectReducer from "./Slice/projectSlice";
import taskReducer from "./Slice/taskSlice";
import commentReducer from "./Slice/commentSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    task: taskReducer,
    comment: commentReducer,
  },
});
