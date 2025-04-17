import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createComment, fetchComments } from "@/redux/Slice/commentSlice";

export default function Comment({ task }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { comments, loading } = useSelector((state) => state.comment);
  const handleSubmit = (e) => {
    if (!comment) return;
    e.preventDefault();
    dispatch(
      createComment({
        comment,
        taskId: task._id,
        token: user.token,
      })
    );
    setComment("");
  };
  useEffect(() => {
    dispatch(fetchComments({ taskId: task._id, token: user.token }));
  }, [dispatch, task._id, user.token]);
  return (
    <>
      <form className="flex justify-between items-center gap-2 w-full">
        <Input
          type="text"
          placeholder="Write a comment..."
          className="w-[350px]"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" onClick={handleSubmit}>
          <SendHorizontal />
        </Button>
      </form>
      <div className="max-h-[300px] overflow-y-scroll">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-2 my-2">
                <div className="border w-full rounded flex justify-between items-start gap-2 px-5 py-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {comment.comment}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ~{comment.commentedBy.name}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
