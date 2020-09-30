import React from 'react';

import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet: this.props.user.pet
        }
    }

    onFormChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onFormSubmit = (data) => {
        fetch(`http://localhost:3500/profile/${this.props.user.id}`,{
                method: 'PUT',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({formInput: data})
            }).then(res => res.json())
            .then(res => {
                this.props.loadUser({ ...this.props.user, ...this.state });
                this.props.toggleModal();
            })
            .catch(console.log);
    }

    render() {
        const { user, toggleModal } = this.props;
        const { name, age, pet } = this.state;

        return (
            <div className="profile-modal">
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
                    <main className="pa4 black-80 w-80">
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="h3 w3 dib" alt="avatar" />

                        <h1>{this.state.name}</h1>
                        <h4>{`Images Submitted: ${user.entries}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>



                        <label className="mt-2 fw6" htmlFor="user-name">Username</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            type="text"
                            name="name"
                            placeholder={user.name}
                            id="user-name"
                        />

                        <label className="mt-2 fw6" htmlFor="user-age">Age:</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            type="text"
                            name="age"
                            placeholder={user.age}
                            id="user-age"
                        />

                        <label className="mt-2 fw6" htmlFor="user-pet">Pet:</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            type="text"
                            name="pet"
                            placeholder={user.pet}
                            id="user-pet"
                        />

                        <div className="mt4" style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <button
                                onClick={() => this.onFormSubmit({ name, age, pet })}
                                className="b pa2 grow pointer hover-white w-40 bg-light-blue">
                                Save
                            </button>

                            <button onClick={toggleModal} className="b pa2 grow pointer hover-white w-40 bg-light-red">
                                Cancel
                            </button>
                        </div>

                    </main>
                    <div onClick={toggleModal} className="modal-close">&times;</div>
                </article>

            </div>
        )
    }

}

export default Profile