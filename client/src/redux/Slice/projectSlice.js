import axios from "axios";
import { backend_url, configure } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  loading: false,
};

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (token) => {
    const config = configure(token);
    const { data } = await axios.get(`${backend_url}/project`, config);
    return data;
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async ({ projectId, token }) => {
    const config = configure(token);
    const { data } = await axios.get(
      `${backend_url}/project/${projectId}`,
      config
    );
    return data;
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async ({ projectDetails, token }) => {
    const config = configure(token);
    const { data } = await axios.post(
      `${backend_url}/project`,
      projectDetails,
      config
    );
    return data;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = [action.payload, ...state.projects];
      })
      .addCase(createProject.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default projectSlice.reducer;
