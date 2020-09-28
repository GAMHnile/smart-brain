import React, { useState } from 'react';

import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

const ProfileIcon = ({onRouteChange, toggleModal}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);


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
                    <DropdownItem onClick={()=>onRouteChange('signout')}>Sign Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}


export default ProfileIcon;