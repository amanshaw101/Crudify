import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import { withRouter } from "../common/with-router";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Tutorial.css"; // Custom CSS for this component

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);

    this.state = {
      currentTutorial: {
        id: null,
        title: "",
        description: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState((prevState) => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        title: title
      }
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        description: description
      }
    }));
  }

  getTutorial(id) {
    TutorialDataService.get(id)
      .then((response) => {
        this.setState({
          currentTutorial: response.data
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updatePublished(status) {
    const data = {
      ...this.state.currentTutorial,
      published: status
    };

    TutorialDataService.update(this.state.currentTutorial.id, data)
      .then((response) => {
        this.setState((prevState) => ({
          currentTutorial: {
            ...prevState.currentTutorial,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateTutorial() {
    TutorialDataService.update(
      this.state.currentTutorial.id,
      this.state.currentTutorial
    )
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The tutorial was updated successfully!"
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteTutorial() {
    TutorialDataService.delete(this.state.currentTutorial.id)
      .then((response) => {
        console.log(response.data);
        this.props.router.navigate("/tutorials");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentTutorial, message } = this.state;

    return (
      <div className="tutorial-container">
        {currentTutorial ? (
          <div className="card tutorial-card">
            <h4 className="card-title text-center mt-3">Edit Tutorial</h4>
            <div className="card-body">
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentTutorial.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentTutorial.description}
                    onChange={this.onChangeDescription}
                    rows="3"
                  />
                </div>
                <div className="status-indicator mb-4">
                  <strong>Status: </strong>
                  {currentTutorial.published ? (
                    <span className="text-success">
                      <FaCheckCircle /> Finished
                    </span>
                  ) : (
                    <span className="text-warning">
                      <FaTimesCircle /> Pending
                    </span>
                  )}
                </div>
              </form>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    this.updatePublished(!currentTutorial.published)
                  }
                >
                  {currentTutorial.published ? "Set Pending" : "Set Finished"}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={this.deleteTutorial}
                >
                  Delete
                </button>

                <button
                  className="btn btn-success"
                  onClick={this.updateTutorial}
                >
                  Update
                </button>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="alert alert-success mt-3 text-center">
                {message}
              </div>
            )}
          </div>
        ) : (
          <div>
            <br />
            <p className="text-muted">Please select a tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Tutorial);