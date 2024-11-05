import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import "./AddTutorial.css"; // Importing a custom CSS file

export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "", 
      published: false,
      submitted: false,
      errors: {}
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
      errors: { ...this.state.errors, title: "" } // Clear error message
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
      errors: { ...this.state.errors, description: "" } // Clear error message
    });
  }

  validateForm() {
    const errors = {};
    if (!this.state.title) errors.title = "Title is required.";
    if (!this.state.description) errors.description = "Description is required.";
    return errors;
  }

  saveTutorial() {
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    const data = {
      title: this.state.title,
      description: this.state.description
    };

    TutorialDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTutorial() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false,
      errors: {}
    });
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h4>Add Tutorial</h4>
          </div>
          <div className="card-body">
            {this.state.submitted ? (
              <div className="alert alert-success">
                <strong>Success!</strong> You submitted successfully!
               <div><button className="btn btn-outline-success mt-3" onClick={this.newTutorial}>
                  Add Another
                </button></div> 
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className={`form-control ${this.state.errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    required
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                    placeholder="Enter the title"
                    name="title"
                  />
                  {this.state.errors.title && (
                    <div className="invalid-feedback">{this.state.errors.title}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${this.state.errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    required
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    placeholder="Enter the description"
                    name="description"
                  />
                  {this.state.errors.description && (
                    <div className="invalid-feedback">{this.state.errors.description}</div>
                  )}
                </div>

                <button onClick={this.saveTutorial} className="btn btn-primary">
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}