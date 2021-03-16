import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="comment">
          New Comment
          <input value={content} onChange={(e) => setContent(e.target.value)} className="form-control" />
        </label>
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
};

CommentCreate.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentCreate;
