import React, {useEffect} from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from "./UI/Components/Auth/Login/Login";
import VeloSite from "./UI/Components/VeloSite/VeloSite";
import Register from "./UI/Components/Auth/Register/Register";
import Cabinet from "./UI/Components/Cabinet/Cabinet";
import RecoverPassword from './UI/Components/Auth/RecoverPassword/RecoverPassword';
import ChangePassword from './UI/Components/Auth/ChangePassword/ChangePassword';
import LinearProgress from './UI/Common/LinearProgress/LinearProgress';
// jest-ignore
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { AppRootStateType } from './BLL/Store';
import { AppStateType } from './BLL/AppReducer';



function App() {
  const appState = useSelector<AppRootStateType, AppStateType>(state => state.AppReducer)
  useEffect(()=> {
   if(appState.notifyMessageOk){
    toast.success(`${appState.notifyMessageOk}`)
   } else if (appState.notifyMessageFailed){
    toast.error(`${appState.notifyMessageFailed}`)
   }
  },[appState])

    return (
        <div className="App">
            
           <ToastContainer />
           {appState.isLoading && <LinearProgress/>}
            <Routes>
                <Route path={"/"} element={<VeloSite />} />
                <Route path={"/velo"} element={<VeloSite/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"/user/recovery"} element={<RecoverPassword/>}/>
                <Route path={"/user/:id/change/:token"} element={<ChangePassword/>}/>
                <Route path={"/cabinet"} element={<Cabinet/>}/>
            </Routes>
        </div>

    );
}

export default App;
