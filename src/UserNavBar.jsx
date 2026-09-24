import { useState } from "react";
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { Home, Brain, Languages, LayoutGrid, MessageCircle, Flag } from "lucide-react";

function UserNavBar(){
    const {t} = useTranslation()
    const menu = [
        {id: 'home', value: t('userNavBar.home'), to: '/dashboard', icon: <Home className="size-5" />},
        {id: 'myActivities', value: t('userNavBar.myActivities'), to:'/activities', icon: <LayoutGrid className="size-5" />},
        {id: 'test', value: t('userNavBar.test'), to: '/test', icon: <Brain className="size-5" />},
        {id: 'conversations', value: t('userNavBar.conversation'), to: '/conversation', icon: <MessageCircle className="size-5" />},
        {id: 'translation', value: t('userNavBar.translation'), to: '/translation', icon: <Languages className="size-5" />},
    ]
    return(
        <div>
            <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 h-[calc(100vh-5rem)] sticky top-20 shrink-0">
                <div className="flex flex-col py-4">
                    {menu.map((item)=>(
                        <Link
                            key={item.id}
                            to={item.to}
                            className="w-full hover:bg-blue-50 hover:text-blue-600 h-14 flex flex-row items-center pl-6 gap-3 transition-colors duration-200"
                            >
                            {item.icon}
                            <span className="font-medium">{item.value}</span>
                        </Link>
                    ))}
                    <Link
                        to= '/signal'
                        className="w-full hover:bg-red-50 hover:text-red-600 h-14 flex flex-row items-center pl-6 gap-3 mt-auto transition-colors duration-200"
                    >
                        <Flag className="size-5" />
                        <span className="font-medium">{t('userNavBar.reporting')}</span>
                    </Link>
                </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex flex-row justify-around items-center h-16 z-50 px-2 pb-safe">
                {menu.slice(0, 5).map((item)=>(
                    <Link
                        key={item.id}
                        to={item.to}
                        className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-blue-600"
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1 truncate w-full text-center px-1">{item.value}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}


export default UserNavBar