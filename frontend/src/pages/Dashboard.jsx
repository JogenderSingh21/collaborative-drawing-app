import { Dashbar } from "../components/Dashbar"
import { Spinner } from "../components/Spinner"
import wave from "../assets/wave.svg"  
import empty from "../assets/empty-box.svg"  
import { PrevBoard } from "../components/PrevBoard"
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

    const [drawings, setDrawings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        fullName: "",
    });

    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:3000/api/v1/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.log(error)
            // navigate("/");
        })

        axios.get("http://localhost:3000/api/v1/drawing/user-drawings", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setDrawings(response.data.drawings);
            setLoading(false);
        }).catch(error => {
            console.log(error)
        })
    }, []);

    return <div className="h-[100vh] bg-slate-50 relative flex flex-col justify-between overflow-y-scroll">
        {loading?<Spinner></Spinner>:<></>}
        <div>
            <div className="sticky top-0">
                <Dashbar user={user}></Dashbar>
            </div>
            <div className="p-3">
                <h1 className="mt-6 ml-4 text-3xl font-medium font-sans">All Boards</h1>
                <div className="mt-6 flex flex-wrap justify-evenly lg:justify-start">
                    {drawings.length!=0?drawings.map((drawing) => {
                        return <PrevBoard onClick={() => {
                            navigate("/whiteboard/" + drawing._id);
                        }} title={drawing.title} dt={drawing.created} image={drawing.image}></PrevBoard>
                    }):<img className="w-96" src={empty} alt="empty" />}
                </div>
            </div>
        </div>
        <div className="w-full">
            <img className="w-full" src={wave} />
        </div>
    </div>
}