import React, { useState, useRef, useEffect } from 'react';
import { RoundedUser } from './RoundedUser';
import { useNavigate } from "react-router-dom";

export const Sidebar = ({user}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    dropdownRef.current.addEventListener('mouseover', (e)=>{setIsOpen(true)});
    dropdownRef.current.addEventListener('mouseout', (e)=>{setIsOpen(false)});
    // buttonRef.current.addEventListener('mouseout', toggleDropdown);


    return () => {
      document.removeEventListener('click', handleClickOutside);

    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        id="dropdownInformationButton"
        onClick={toggleDropdown}
        className="rounded-full text-center inline-flex items-center focus:outline-none focus:ring focus:ring-slate-200"
        type="button"
      >
        <RoundedUser label={user.fullName[0]} />
        
      </button>

      {isOpen && (
        <div
          id="dropdownInformation"
          className="z-10 absolute right-0 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{`${user.fullName}`}</div>
            <div className="font-medium truncate">{user.username}</div>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-mycolor-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-mycolor-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-mycolor-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </a>
            </li>
          </ul>
          <div className="" onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
            }}>
            <a
              href="#"
              className="block px-4 py-4 text-sm text-gray-700 hover:bg-mycolor-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

