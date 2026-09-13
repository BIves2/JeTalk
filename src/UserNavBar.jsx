import { useState } from "react";
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { Home, Brain, Languages, LayoutGrid, MessageCircle, Flag } from "lucide-react";

function UserNavBar(){
    const {t} = useTranslation()
    const menu = [
        {id: 'home', value: t('userNavBar.home'), to: '/', icon: <Home />},
        {id: 'myActivities', value: t('userNavBar.myActivities'), to:'/activities', icon: <LayoutGrid />},
        {id: 'test', value: t('userNavBar.test'), to: '/test', icon: <Brain />},
        {id: 'conversations', value: t('userNavBar.conversation'), to: '/conversation', icon: <MessageCircle />},
        {id: 'translation', value: t('userNavBar.translation'), to: '/translation', icon: <Languages />},
    ]
    return(
        <div className="w-60 h-vh overflow-auto bg-white">
            <div className="flex flex-col">
                {menu.map((item)=>(
                    (item.id !== "reporting" &&
                    <Link
                        key={item.id}
                        to={item.to}
                        className="w-full hover:bg-blue-400 hover:text-white h-20 flex flex-row items-center pl-5"
                        >
                        {item.icon}
                        {item.value}
                    </Link>
                    )
                ))}
                <Link
                    to= '/signal'
                    className="w-full hover:bg-red-500 hover:text-white h-20 flex flex-row items-center pl-5"
                >
                    <Flag />
                    {t('userNavBar.reporting')}
                </Link>
            </div>
        </div>
    )
}

export default UserNavBar