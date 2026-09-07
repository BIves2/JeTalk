import { useState } from "react";
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";

function UserNavBar(){
    const {t} = useTranslation()
    const menu = [
        {id: 'home', value: t('userNavBar.home'), to: '/'},
        {id: 'myActivities', value: t('userNavBar.myActivities'), to:''},
        {id: 'test', value: t('userNavBar.test'), to: ''},
        {id: 'conversations', value: t('userNavBar.conversation'), to: ''},
        {id: 'translation', value: t('userNavBar.translation'), to: ''},
        {id: 'signalement', value: t('userNavBar.reporting'), to:''}
    ]
    return(
        <div className="w-60 h-vh border overflow-auto">
            <div className="flex flex-col">
                {menu.map((item)=>(
                    <Link
                        key={item.id}
                        to={item.to}
                        className="text-center w-full hover:bg-amber-200 h-20 flex flex-col justify-center"
                    >
                        {item.value}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default UserNavBar