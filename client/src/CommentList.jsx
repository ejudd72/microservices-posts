import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ul>
      {comments.map((comment) => <li key={comment.id}>{comment.content}</li>)}
    </ul>
  );
};

CommentList.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentList;
