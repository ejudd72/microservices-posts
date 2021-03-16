import React, { useState } from 'react';
import axios from 'axios';

export default () => {
  const [title, setTitle] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post('http://localhost:4000/posts', {
      title,
    });

    setTitle('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} id="title" className="form-control" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
