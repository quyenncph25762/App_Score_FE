import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
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
import ObjectPage from './pages/Object/Object';
import DepartmentPage from './pages/Department/DepartmentPage';
import ScoreTempPage from './pages/ScoreTemp/ScoreTempPage';
import ScoreTempAdd from './pages/ScoreTemp/ScoreTempAdd';
import ObjectPageTrash from './pages/Object/ObjectTrash';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Aside></Aside>}>
          <Route index element={<HomePage></HomePage>}></Route>
          <Route path='/criteria' element={<Criteria></Criteria>}></Route>
          {/* userPage */}
          <Route path='/users' element={<UsersPage></UsersPage>}></Route>
          <Route path='/users/trash' element={<UsersTrash></UsersTrash>}></Route>
          {/* department */}
          <Route path='/department' element={<DepartmentPage></DepartmentPage>}></Route>
          <Route path='/department/trash' element={<DepartmentTrash></DepartmentTrash>}></Route>
          {/* object */}
          <Route path='/object' element={<ObjectPage></ObjectPage>}></Route>
          <Route path='/object/trash' element={<ObjectPageTrash></ObjectPageTrash>}></Route>
          {/* Phiếu chấm */}
          <Route path='/scoretemp' element={<ScoreTempPage></ScoreTempPage>}></Route>
          <Route path='/scoretemp/add' element={<ScoreTempAdd></ScoreTempAdd>}></Route>
          <Route path='/object/trash' element={<DepartmentTrash></DepartmentTrash>}></Route>
        </Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/sendEmail' element={<SendEmailPage></SendEmailPage>}></Route>
        <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
        <Route path='/err500' element={<Error500></Error500>}></Route>
      </Routes>


    </div>
  )
}

export default App
