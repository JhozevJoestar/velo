import { AppThunkType } from "./Store"
import { APItodolist, CreateUserArgType, CreateUserResType, GetUserArgType, GetUserProfileResType, changeUserNameArgType, meResType, recoverPasswordArgType, checkPasswordElems, changeSubscribeArgType } from "../DAL/Api"
import { setLoadingAC, setNotifyMessageFailedAC, setNotifyMessageOkAC } from "./AppReducer"



export type InitialStateType = {
    profileData : GetUserProfileResType | null
    regData : CreateUserResType | null
}
const profile : InitialStateType = {
profileData : null,
regData :  null
}
export const authReducer = ( state : InitialStateType = profile, action : ProfileActionsTypes ) : InitialStateType => {
    switch(action.type){
        case "SetUserRegData" : 
            return {...state, regData : action.userData}
        case "SetUserData" :
            return {...state, profileData : action.userData}
        case "Me" : 
            return {...state, profileData : {...action.userData, token : null}}
        case "Logout" :
            return {profileData : null, regData : null}
        default :
            return state
    }
}



export const setUserProfileAC = (userData : GetUserProfileResType) => {
  return  {type : "SetUserData", userData} as const
}
export const meAC = (userData : meResType) => {
    return  {type : "Me", userData} as const
  }
export const logoutAC = () => {
    return  {type : "Logout"} as const
  }
export const setUserRegDataAC = (userData : CreateUserResType) => {
    return  {type : "SetUserRegData", userData} as const
  }





export const getUserProfileTC = (getUserData : GetUserArgType) : AppThunkType => {
     return (dispatch) => {
       
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        
        dispatch(setLoadingAC(true))
        APItodolist.getUserProfile(getUserData)
        .then( res => {
        if(res.status === 200){
      
        dispatch(setUserProfileAC(res.data))
        const token = res.data.token;
        localStorage.setItem('jwtToken', token as string);
        dispatch(setLoadingAC(false))
        // localStorage.setItem('userPassword', getUserData.password);
        // localStorage.setItem('userEmail', getUserData.email);
         }
        }) 
        .catch(e=> {
         if(e.message === "Network Error"){

            dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
            dispatch(setLoadingAC(false))
         } else if(e.response.data.error = "User not found") {
            dispatch(setNotifyMessageFailedAC("Пользователь с таким E-mail или паролем не найден"))
            dispatch(setLoadingAC(false))
         }
        })
}}


export const meTC = (token : string) : AppThunkType => {
    return (dispatch) => {
       dispatch(setNotifyMessageFailedAC(""))
       dispatch(setNotifyMessageOkAC(""))
       dispatch(setLoadingAC(true))
       APItodolist.me(token)
       .then( res => {
       if(res.status === 200){
     
       dispatch(meAC(res.data))
       dispatch(setLoadingAC(false))
        }
       }) 
       .catch(e=> {
        if(e.message === "Network Error"){
           dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
           dispatch(setLoadingAC(false))
        } else if(e.response.data.error) {
           dispatch(setNotifyMessageFailedAC("Попробуйте выполнить запрос позже"))
           dispatch(setLoadingAC(false))
        }
       })
}}


export const createUserProfile = (createUserData : CreateUserArgType) : AppThunkType => {
    return (dispatch) => {  
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        dispatch(setLoadingAC(true))
        
       APItodolist.createUserProfile(createUserData)
        .then( res => {
            if(res.status === 200){
               
                dispatch(setUserRegDataAC(res.data)) 
               }
               dispatch(setLoadingAC(false))
           })
        .catch(e => {
            if(e.message === "Network Error"){
              
                dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
                dispatch(setLoadingAC(false))
            } else if(e.response.data.message === "User already created")
            dispatch(setNotifyMessageFailedAC("Такой пользователь существует"))
            dispatch(setLoadingAC(false))
        })  
}}

export const changeUserName = (changeUserNameData : changeUserNameArgType) : AppThunkType => {
    return (dispatch) => {
       
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
       
        dispatch(setLoadingAC(true))
        
       APItodolist.changeUserName(changeUserNameData)
        .then( res => {
            if(res.status === 200){
                const token  = localStorage.getItem('jwtToken') as string;
                dispatch(setLoadingAC(false));
                dispatch(meTC(token))
               }
           })
        .catch(e => {
            if(e.message === "Network Error"){
                dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
                dispatch(setLoadingAC(false))
            } 
            else {
            dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте еще раз"))
            dispatch(setLoadingAC(false))
            }
        })  
}}


export const getCodeForRecoverTC = (email : string) : AppThunkType=> {
    return (dispatch) => {
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        dispatch(setLoadingAC(true))
        
       APItodolist.getCodeForRecover(email)
        .then( res => {
            if(res.status === 200){
                dispatch(setNotifyMessageOkAC("Вам на почту отправлена ссылка"))
                dispatch(setLoadingAC(false));
               }
           })
        .catch(e => {
            if(e.message === "Network Error"){
                dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
                dispatch(setLoadingAC(false))
            } else if (e.response.status === 400){
                dispatch(setNotifyMessageFailedAC(`Поверьте почту, ссылка отправлена на адрес ${email}`))
                dispatch(setLoadingAC(false))
            }
            else {
            dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте еще раз"))
            dispatch(setLoadingAC(false))
            }
        }) 
    }
}

export const recoverPasswordTC = (recoverPasswordData : recoverPasswordArgType) : AppThunkType=> {
    return (dispatch) => {
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
       
        dispatch(setLoadingAC(true))
        
       APItodolist.recoverPassword(recoverPasswordData)
        .then( res => {
            if(res.status === 200){
                dispatch(setNotifyMessageOkAC("Вы успешно сменили пароль"))
                dispatch(setLoadingAC(false));
               }
           })
        .catch(e => {
            if(e.message === "Network Error"){
                dispatch(setNotifyMessageFailedAC("Ошибка сети, проверьте соединение"))
                dispatch(setLoadingAC(false))
            } else if (e.response.status === 400){
                dispatch(setNotifyMessageFailedAC("Письмо уже было отправлено"))
            } else {
            dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте еще раз"))
            dispatch(setLoadingAC(false))
            }
        }) 
    }
}

export const checkPasswordToken = (changePasswCheck: checkPasswordElems) : AppThunkType=> {
    return (dispatch) => {

        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        dispatch(setLoadingAC(true))

        APItodolist.getCheckedPasswordToken(changePasswCheck)
        .then( res => {
            if(res.status === 200){}
           })
        .catch(e => {
            if(e.message === "Network Error"){
                // window.location.href = 'https://wattattack.ru/user/recovery';
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так1, попробуйте позже"))
            } else if (e.response.status === 400){
                // window.location.href = 'https://wattattack.ru/user/recovery';
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так2, попробуйте позже"))
            } else if (e.response.status === 404){
                // window.location.href = 'https://wattattack.ru/user/recovery';
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так3, попробуйте позже"))
            }
            else {
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так4, попробуйте еще раз"))
                // window.location.href = 'https://wattattack.ru/user/recovery';
            }
        }) 
    }
}

export const changePassword = (id : number, code : string, password: string) : AppThunkType=> {
    return (dispatch) => {
        
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        dispatch(setLoadingAC(true))

        APItodolist.changePassword(id, code, password)
        .then( res => {
            if(res.status === 200){
                dispatch(setNotifyMessageOkAC("Пароль успешно изменен"))
            }
           })
        .catch(e => {
            if(e.message === "Network Error"){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте позже"))
            } else if (e.response.status === 400){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте позже"))
            } else if (e.response.status === 404){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте позже"))
            }
            else {
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так, попробуйте еще раз"))
            }
        }) 
    }
}

export const changeSubscribe = (changeSubscribeElems: changeSubscribeArgType) : AppThunkType=> {
    return (dispatch) => {
        
        dispatch(setNotifyMessageFailedAC(""))
        dispatch(setNotifyMessageOkAC(""))
        dispatch(setLoadingAC(true))

        APItodolist.changeSubscribe(changeSubscribeElems)
        .then( res => {
            if(res.status === 200){
                console.log("res" + res)
                dispatch(setNotifyMessageOkAC("Пароль успешно изменен"))
            }
           })
        .catch(e => {
            if(e.message === "Network Error"){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так1, попробуйте позже"))
            } else if (e.response.status === 400){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так2, попробуйте позже"))
            } else if (e.response.status === 404){
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так3, попробуйте позже"))
            }
            else {
                dispatch(setNotifyMessageFailedAC("Что-то пошло не так4, попробуйте еще раз"))
            }
        }) 
    }
}
// ActionCreator types 
export type ProfileActionsTypes = ReturnType<typeof setUserProfileAC> | ReturnType<typeof setUserRegDataAC> | ReturnType<typeof meAC> | ReturnType<typeof logoutAC>

