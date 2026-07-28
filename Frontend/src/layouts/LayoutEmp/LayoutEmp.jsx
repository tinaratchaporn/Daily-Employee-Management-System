import { Outlet } from 'react-router';
import './LayoutEmp.css'
import SidebarEmp from '../SidebarEmp/SidebarEmp'

function LayoutEmp() {
          return(
                    <div className='layout'>
                              <SidebarEmp />
                              <Outlet />

                    </div>
          )
}

export default LayoutEmp;