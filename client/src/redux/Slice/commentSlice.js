import axios from "axios";
import { backend_url, configure } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  loading: false,
};

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ comment, taskId, token }) => {
    const config = configure(token);
    const { data } = await axios.post(
      `${backend_url}/comment/${taskId}`,
      { comment },
      config
    );
    return data;
  }
);

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async ({ taskId, token }) => {
    const config = configure(token);
    const { data } = await axios.get(
      `${backend_url}/comment/${taskId}`,
      config
    );
    return data;
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = [action.payload, ...state.comments];
      })
      .addCase(createComment.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default commentSlice.reducer;
