import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Aside from './components/Aside';
import Criteria from './pages/Criteria/Criteria';
import "react-toastify/dist/ReactToastify.css";
import UsersPage from './pages/UserPage/UsersPage';
import PageNotFound from './pages/PageNotFound';
import SendEmailPage from './pages/SendEmailPage';
import Error500 from './pages/Error500';
import DepartmentTrash from './pages/Department/DepartmentTrash';
import UsersTrash from './pages/UserPage/UsersTrash';
import DepartmentPage from './pages/Department/DepartmentPage';
import ScoreTempPage from './pages/ScoreTemp/ScoreTempPage';
import ScoreTempAdd from './pages/ScoreTemp/ScoreTempAdd';
import { useFetchAllDepartmentQuery } from './store/department/department.service';
import { IDepartment } from './store/department/department.interface';
import RolePage from './pages/Role/RolePage';
import RoleTrash from './pages/Role/RoleTrash';
import ObjectPage from './pages/Object/Object';
import ObjectPageTrash from './pages/Object/ObjectTrash';

function App() {
  const navigate = useNavigate()
  // api listDepartment
  // const [listDepartmentApiState, setListDepartmentApiState] = useState<IDepartment[]>([]);
  // const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
  // if (isErrorDepartmenApi) {
  //   navigate("/err500")
  //   return
  // }
  // useEffect(() => {
  //   if (listDepartmentApi) {
  //     setListDepartmentApiState(listDepartmentApi)
  //   }
  // }, [isSuccessDepartmentApi])
  return (
    <div>
      <div >
        <Routes>
          <Route path='/' element={<Aside></Aside>}>
            <Route index element={<HomePage></HomePage>}></Route>
            <Route path='/criteria' element={<Criteria></Criteria>}></Route>
            {/* userPage */}
            <Route path='/users' element={<UsersPage></UsersPage>}></Route>
            <Route path='/users/trash' element={<UsersTrash></UsersTrash>}></Route>
            {/* Lĩnh vực */}
            <Route path='/department' element={<DepartmentPage></DepartmentPage>}></Route>
            <Route path='/department/trash' element={<DepartmentTrash></DepartmentTrash>}></Route>
            {/* object */}
            <Route path='/object' element={<ObjectPage></ObjectPage>}></Route>
            <Route path='/object/trash' element={<ObjectPageTrash></ObjectPageTrash>}></Route>
            {/* Phiếu chấm */}
            <Route path='/scoretemp' element={<ScoreTempPage ></ScoreTempPage>}></Route>
            <Route path='/scoretemp/add' element={<ScoreTempAdd></ScoreTempAdd>}></Route>
            <Route path='/object/trash' element={<DepartmentTrash></DepartmentTrash>}></Route>
            {/* Vai trò */}
            <Route path='/roles' element={<RolePage></RolePage>}></Route>
            <Route path='/roles/trash' element={<RoleTrash></RoleTrash>}></Route>
          </Route>
          <Route path='/login' element={<LoginPage></LoginPage>}></Route>
          <Route path='/sendEmail' element={<SendEmailPage></SendEmailPage>}></Route>
          <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
          <Route path='/err500' element={<Error500></Error500>}></Route>
        </Routes>

      </div>
    </div>
  )
}

export default App
