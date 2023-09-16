import React, { useEffect, useState } from "react"
import style from "./ChangePassword.module.css"
import AuthHeader from "../Header/AuthHeader";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../CustomHooks/UseAppDispatch";
import { checkPasswordToken, changePassword} from "../../../../BLL/AuthReducer";
import { useFormik } from "formik";
const ChangePassword = () => {
    const { id, token } = useParams();
    const dispatch = useAppDispatch();
    let idNumber = 0;
    let tokenScript = "а";
    if(id !== undefined && token !== undefined) {
        idNumber = parseFloat(id);
        tokenScript = token;
    }
    let changePasswCheck = {
        id: idNumber,
        code: tokenScript
    }
    useEffect(() => {
        dispatch(checkPasswordToken(changePasswCheck))
    }, []);

    const [showErrors, setShowErrors] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmNewPass : ''
        },
        onSubmit: values => {
            formik.resetForm()
            dispatch(changePassword(idNumber, tokenScript, values.newPassword))
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.newPassword) {
                errors.newPassword = "Пожалуйста, введите пароль";
            }
            if(!values.confirmNewPass){
                errors.confirmNewPass = "Пожалуйста, подтвердите пароль";
            } else if (values.newPassword !== values.confirmNewPass) {
                errors.confirmNewPass = "Пароли не совпадают. Попробуйте еще раз";
            }
            return errors;
        }
    });

    const handleClickShowErrors = () => {
        setShowErrors(true);
   };
    
    
    return (
        <div className={style.container}>
            <AuthHeader />
            <div className={style.change_container}>
                <div className={style.change_container_title}>
                    ИЗМЕНЕНИЕ ПАРОЛЯ
                </div>
                <form onSubmit={formik.handleSubmit} className={style.changeForm}>
                        <input
                            id={"newPassword"}
                            type="password"
                            placeholder={"Введите новый пароль"}
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                            className={
                                formik.errors.newPassword
                                    ? style.changeErrorInput
                                    : style.changeInput
                            }
                        />
                        {formik.errors.newPassword && showErrors &&(
                            <div className={style.errorMessage}>
                                {formik.errors.newPassword}
                            </div>
                        )}
                        <input
                            id={"confirmNewPass"}
                            type="password"
                            placeholder={"Подтвердите новый пароль"}
                            value={formik.values.confirmNewPass}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                            className={
                                formik.errors.confirmNewPass
                                    ? style.changeErrorInput
                                    : style.changeInput
                            }
                        />
                        {formik.errors.confirmNewPass && showErrors &&(
                            <div className={style.errorMessage}>
                                {formik.errors.confirmNewPass}
                            </div>
                        )}
                        <button type="submit" className={style.changeBtn} style={{marginTop : "10px"}} onClick={handleClickShowErrors}>ВОССТАНОВИТЬ</button>
                    </form>
            </div>
        </div>
    )
}

export default ChangePassword;