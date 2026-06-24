// @ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";
import { createLogEntry } from "./Api";

const LogEntryForm = ({ lat, lng, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = lat;
      data.longitude = lng;
      const created = await createLogEntry(data);
      console.log("Created Log Entry:", created);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3>{error}</h3> : null}
      <label htmlFor="title">Title</label>
      <input {...register("title")} required />

      <label htmlFor="comments">Comments</label>
      <textarea rows={3} {...register("comments")}></textarea>

      <label>Rating</label>
      <input type="number" min="1" max="5" {...register("rating")} />

      <label htmlFor="description">Description</label>
      <textarea rows={3} {...register("description")}></textarea>

      <label htmlFor="image">Image</label>
      <input {...register("image")} />

      <label htmlFor="visitDate">Visit Date</label>
      <input type="date" required {...register("visitDate")} />

      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogEntryForm;
