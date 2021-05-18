import React, { useState } from 'react';
import { Button } from './Button';
import './Navbar.css';
import Dropdown from './Dropdown';
import { Link } from 'react-router-dom';

function Navbar() {
    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
         } else {
            setDropdown(true);
        }
    }

    const onMouseLeave = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
         } else {
            setDropdown(false);
        }
    }

    return (
        <>
            <nav className='navbar'>
                <Link to='/' className='navbar-logo'>
                    INVEST APP <i className='fab fa-firstdraft' />
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            Dashboard
                        </Link>
                    </li>
                    <li className='nav-item' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        <Link to='/my-profile' className='nav-links' onClick={closeMobileMenu}>
                            Profile
                            {/* Profile <i className='fas fa-caret-down' /> */}
                        </Link>
                        {/* {dropdown && <Dropdown />} */}
                    </li>
                    <li className='nav-item'>
                        <Link to='/transactions' className='nav-links' onClick={closeMobileMenu}>
                            Transactions
                        </Link>
                    </li>
                </ul>
                <Button />
            </nav>
        </>
    )
}

export default Navbar;
