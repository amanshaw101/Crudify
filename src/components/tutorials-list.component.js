import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
import './TutorialsList.css'; // Ensure you have CSS for styling

export default class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;
    this.setState({ searchTitle });
  }

  retrieveTutorials() {
    TutorialDataService.getAll()
      .then(response => {
        this.setState({ tutorials: response.data });
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTutorials();
    this.setState({ currentTutorial: null, currentIndex: -1 });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({ currentTutorial: tutorial, currentIndex: index });
  }

  removeAllTutorials() {
    TutorialDataService.deleteAll()
      .then(() => {
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({ currentTutorial: null, currentIndex: -1 });

    TutorialDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({ tutorials: response.data });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, tutorials, currentTutorial, currentIndex } = this.state;

    return (
      <div className="tutorials-list container mt-5">
        <h2 className="text-center mb-4">Tutorials</h2>
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTitle}
                onChange={this.onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.searchTitle}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h4 className="mb-3">Tutorial List</h4>
            <div className="card-deck">
              {tutorials && tutorials.map((tutorial, index) => (
                <div className={`card mb-3 ${index === currentIndex ? "border-primary" : ""}`} key={index} onClick={() => this.setActiveTutorial(tutorial, index)}>
                  <div className="card-body">
                    
                    <h5 className="card-title">{tutorial.title}</h5>
                    <p className="card-text">{tutorial.description.substring(0, 100)}...</p>
                    <span className={`badge badge-${tutorial.published ? 'success' : 'warning'}`}>
                      {tutorial.published ? "Finished" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="m-3 btn btn-danger"
              onClick={this.removeAllTutorials}
            >
              Remove All
            </button>
          </div>
          <div className="col-md-6">
            {currentTutorial ? <div className="tutorial-details border rounded p-3">
                <h4>Tutorial Details</h4>
                <div>
                  <label><strong>Title:</strong></label> {currentTutorial.title}
                </div>
                <div>
                  <label><strong>Description:</strong></label> {currentTutorial.description}
                </div>
                <div>
                  <label><strong>Status:</strong></label> 
                  <span className={`badge badge-${currentTutorial.published ? 'success' : 'warning'}`}>
                    {currentTutorial.published ? "Finished" : "Draft"}
                  </span>
                </div>
                <Link to={`/tutorials/${currentTutorial.id}`} className="badge badge-warning mt-2">
                  Edit
                </Link>
              </div>
             : (
              <div className="d-inline-block text-truncate mt-5">
                <p>Please click on a Tutorial...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}