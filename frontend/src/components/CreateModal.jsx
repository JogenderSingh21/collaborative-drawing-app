import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateModal() {
  const [showModal, setShowModal] = React.useState(false);

  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <button
        className="w-full block px-4 py-2 hover:bg-mycolor-100 dark:hover:bg-gray-600 dark:hover:text-white"
        type="button"
        onClick={() => {
            setShowModal(true);
        }}
      >
        Create Board
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl min-w-80">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    New WhiteBoard
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                
                <div class="p-4 md:p-5">
                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label for="name" class="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Title<span className="text-red-500">*</span></label>
                            <input onChange={(e) => {
                              setTitle(e.target.value);
                            }} type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Drawing Title" required="" />
                        </div>
                        <div class="col-span-2">
                            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description <span className="text-gray-600 font-light">{"(optional)"}</span></label>
                            <textarea id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write Drawing description here"></textarea>                    
                        </div>
                    </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 hover:text-red-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 flex text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      console.log(title);
                      axios.post("http://localhost:3000/api/v1/drawing/create", {
                        title: title
                      }, {
                        headers: {
                          Authorization: "Bearer " + localStorage.getItem("token")
                        }
                      }).then((response) => {
                        const drawId = response.data.drawId;
                        navigate("/whiteboard/" + drawId);
                      }).catch((error) => {
                        alert(error.response.data.message);
                      })

                      setShowModal(false);                      
                    }}
                  >
                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}