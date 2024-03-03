import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CreateModal from './CreateModal';
import JoinModal from './JoinModal';

export const AddBoard = () => {
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
        className="rounded-full text-center inline-flex items-center hover:text-blue-400 focus:outline-none focus:ring focus:ring-slate-200"
        type="button"
      >
        <svg
            className="w-11 h-11 "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            >
            <path
                d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
            />
            <line
                x1="256"
                y1="176"
                x2="256"
                y2="336"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
            />
            <line
                x1="336"
                y1="256"
                x2="176"
                y2="256"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
            />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="5 0 24 24"
              width="24px"
              height="24px"
              fill="currentColor" 
              className=""
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
              />
            </svg>
      </button>

      {isOpen && (
        <div
          id="dropdownInformation"
          className="z-10 absolute right-0 w-32 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            <li>
              <div onClick={() => {
                setIsOpen(true);
              }}>
                <CreateModal></CreateModal>
              </div>
            </li>
            <li>
            <div onClick={() => {
              setIsOpen(true);
            }}>
              <JoinModal></JoinModal>
            </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

