export const PrevBoard = ({ title, image, dt, onClick }) => {

    function formatDate(date) {
        const currentDate = new Date();
        const inputDate = new Date(date);
        console.log(currentDate.getDate(),inputDate.getDate());
    
        const diffTime = Math.abs(currentDate - inputDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = (currentDate.getMonth() + 1) - (inputDate.getMonth() + 1) + (12 * (currentDate.getFullYear() - inputDate.getFullYear()));
    
        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            if (currentDate.getDate() === inputDate.getDate()){
                return "Today"
            }
            return "1 day ago";
        } else if (diffDays < 31) {
            return diffDays + " days ago";
        } else if (diffMonths === 1) {
            return "1 month ago";
        } else {
            return diffMonths + " months ago";
        }
    }

    return <div onClick={onClick} className="hover:bg-mycolor-100 p-4 mt-2 mr-2 rounded w-fit hover:cursor-pointer hover:shadow-md">
        <div className="w-52 h-52 bg-white rounded-lg shadow-lg overflow-hidden">
            {image?<img className="h-52" src={image} />
                :<svg className="w-52 h-52" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#dbdbdb" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"><path d="M4.80665 17.5211L9.1221 9.60947C9.50112 8.91461 10.4989 8.91461 10.8779 9.60947L14.0465 15.4186L15.1318 13.5194C15.5157 12.8476 16.4843 12.8476 16.8682 13.5194L19.1451 17.5039C19.526 18.1705 19.0446 19 18.2768 19H5.68454C4.92548 19 4.44317 18.1875 4.80665 17.5211Z" fill="#c2c2c2"></path> <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z" fill="#c2c2c2"></path> </g></svg>
            }
        </div>
        <h2 className="text-lg font-medium mt-2">{title?title:`Created ${dt}`}</h2>
        <h3 className="text-md text-gray-500">{formatDate(dt)}</h3>
    </div>
}