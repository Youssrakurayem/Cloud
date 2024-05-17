import React from 'react';
import axios from 'axios';
import './BookApp.css';

const BookForm = ({ formData, handleChange, handleSubmit, handleFileChange }) => {
  return (
    <div className="floating-container">
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

const BookList = ({ books, handleUpdate, handleDelete }) => {
  return (
    <div className="floating-container">
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>Title:</strong> {book.title} | <strong>Author:</strong> {book.author} |{' '}
            <strong>Description:</strong> {book.description}{' '}
            <img src={`data:image/jpeg;base64,${book.imageData}`} alt={book.title} />
            <button className="btn-update" onClick={() => handleUpdate(book.id)}>Update</button>{' '}
            <button className="btn-delete" onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

class BookApp extends React.Component {
  state = {
    formData: {
      title: '',
      author: '',
      description: ''
    },
    books: []
  };

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/books');
      this.setState({ books: response.data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value }
    });
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('title', this.state.formData.title);
    formData.append('author', this.state.formData.author);
    formData.append('description', this.state.formData.description);
    try {
      await axios.post('http://localhost:3001/books', formData);
      alert('Book added successfully');
      this.fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    }
  };

  handleUpdate = async (id) => {
    const newDescription = prompt('Enter new description:');
    if (newDescription !== null) {
      try {
        await axios.put(`http://localhost:3001/books/${id}`, { description: newDescription });
        this.fetchBooks();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    }
  };

  handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/books/${id}`);
        this.fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };
  render() {
    return (
      <div className="book-app">
        {this.state.successMessage && <div className="success-message">{this.state.successMessage}</div>}
        <BookForm
          formData={this.state.formData}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleFileChange={this.handleFileChange}
        />
        <BookList
          books={this.state.books}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default BookApp;
