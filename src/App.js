import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//routes are signin home default is signin
//isSignedIn default is false
const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    age: '',
    pet: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  componentDidMount(){
    const token = window.sessionStorage.getItem("token");
    if(token){
      fetch("http://localhost:3500/signin",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }).then(resp=>resp.json())
      .then(data=>{
        if(data && data.id){
          fetch(`http://localhost:3500/profile/${data.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            } 
          })
          .then(resp=>resp.json())
          .then(user =>{
            if(user && user.email){
              this.loadUser(user);
              this.onRouteChange("home");
            }
          })
        }
        
      })
      .catch(console.log);
    }
  }

  calculateFaceLocation = (data) => {
    //const clarifaiFace1 = data.outputs[0].data.regions[0].region_info.bounding_box;
    if(data.outputs){
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
  
      const faceBoxes = data.outputs[0].data.regions.map(region => {
        const box = region.region_info.bounding_box
        return ({
          leftCol: box.left_col * width,
          topRow: box.top_row * height,
          rightCol: width - (box.right_col * width),
          bottomRow: height - (box.bottom_row * height)
        })
      })
      return faceBoxes;
    }
    return 
  }

  displayFaceBox = (boxes) => {
    if(boxes){
      this.setState({ boxes });
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3500/imageurl', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3500/image', {
            method: 'put',
            headers: { 
              'Content-Type': 'application/json', 
              "Authorization": window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}  />
        {isProfileOpen &&
          <Modal>
            <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser} />
          </Modal>}
        { route === 'home'
          ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
