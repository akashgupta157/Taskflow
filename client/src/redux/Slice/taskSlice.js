import axios from "axios";
import { backend_url, configure } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  loading: false,
};

export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ taskDetails, projectId, token }) => {
    const config = configure(token);
    const { data } = await axios.post(
      `${backend_url}/task/${projectId}`,
      taskDetails,
      config
    );
    console.log(data);
    return data;
  }
);

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async ({ projectId, token, assignedTo, sortBy }) => {
    const config = configure(token);
    const { data } = await axios.get(`${backend_url}/task/${projectId}`, {
      ...config,
      params: {
        assignedTo,
        sortBy,
      },
    });
    return data;
  }
);

export const updateTask = createAsyncThunk(
  "task/updatedTask",
  async ({ status, taskId, token }) => {
    const config = configure(token);
    const { data } = await axios.patch(
      `${backend_url}/task/${taskId}`,
      { status },
      config
    );
    return data;
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = [action.payload, ...state.tasks];
      })
      .addCase(createTask.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) => {
          if (task._id === action.payload._id) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(updateTask.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default taskSlice.reducer;
