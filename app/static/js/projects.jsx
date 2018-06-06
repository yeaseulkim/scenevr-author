import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import IndividualProject from './components/IndividualProject.jsx';

export default class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projectData: null,
      error: null,
      redirectCreate: false,
      redirectLogout: false,
      newProjectId: null,
      userName: null,
      userPicture: null
    };

    this.newProject = this.newProject.bind(this);
  }

  componentDidMount() {
    fetch("/projects", {'credentials': 'include'})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            projectData: result['projectArray'],
            userName: result['userName'],
            userPicture: result['userPicture']
          });
        },
        (error) => {
          this.setState({error});
        }
      )
  }

  newProject(){
    var url = '/create-project';

    fetch(url, {
      method: 'POST',
      body: null,
      headers:{
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        this.setState({
          redirectCreate: true,
          newProjectId: result.project_id
        });
      },
      (error) => {
        this.setState({error});
      }
    )
  }

  render() {
    const { error, projectData, redirectCreate} = this.state;
    if (redirectCreate){
      return (
        <Redirect to={{
          pathname: '/create',
          state: {
              projectId: this.state.newProjectId
            }
          }}/>
      );
    }


    const projects = projectData ? (
      projectData.map(proj => (
        <IndividualProject key={proj.id} id={proj.id} title={proj.title} desc={proj.desc} date={proj.date} thumbnail={proj.thumbnail} />
      ))
    ) : (null);

    if (error){
      return <div>Error: {error.message}</div>;
    }
    else{
      return (
        <div id="projects">
          <div id="header">
            <a href="/logout">
              <img id="user-picture" src={this.state.userPicture}/>
            </a>
            <div id="user-name"> {this.state.userName} </div>
          </div>
          <div id="title">
            <div> Your Projects </div>
          </div>
          <div id="project-container">
            {projects}
          </div>
          <div id="new-project" className="link" onClick={this.newProject}>
            <div> NEW PROJECT </div>
          </div>
        </div>
      );
    }
  }
}
