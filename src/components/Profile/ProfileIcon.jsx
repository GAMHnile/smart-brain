import React, { useState } from 'react';

import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

const ProfileIcon = ({onRouteChange, toggleModal}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const signOutHandler = () =>{
        fetch("http://localhost:3500/signout",{
            method: "DELETE",
            headers: {"Authorization": window.sessionStorage.getItem("token")}
        })
        .then(res=>{
            window.sessionStorage.removeItem("token");
        })
        .catch(err=> window.sessionStorage.removeItem("token"))
        onRouteChange('signout');
    }

    return (
        <div className="pa4 tc">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={dropdownOpen}
                >
                    <img
                        src="http://tachyons.io/img/logo.jpg"
                        className="br-100 ba h3 w3 dib" alt="avatar" />
                </DropdownToggle>
                <DropdownMenu 
                className="b--transparent shadow-5" 
                style={{ marginTop: "5px", backgroundColor: "rgba(255,255,255,0.5)", right: "5px" }}
                right={true}
                >
                    <DropdownItem  onClick={toggleModal}>View Profile</DropdownItem>
                    <DropdownItem onClick={signOutHandler}>Sign Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}


export default ProfileIcon;