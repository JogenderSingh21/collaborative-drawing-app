import logo from '../assets/newLogo.png'
import { AddBoard } from './AddBoard'
import { RoundedUser } from './RoundedUser'
import { Sidebar } from './Sidebar'

export const Dashbar = ({ user }) => {
    return <div className='flex px-7 py-3 shadow-md justify-between bg-slate-50 sticky'>
        <div className='hover:cursor-pointer'>
            <img className='h-10' src={logo} alt='logo' />
        </div>
        <div className='flex space-x-6'>
            <AddBoard></AddBoard>
            <Sidebar user={user}></Sidebar>
        </div>
    </div>
}