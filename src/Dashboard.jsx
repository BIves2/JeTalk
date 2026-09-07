import NavBar from "./NavBar"
import Footer from "./Footer"
import UserNavBar from "./UserNavBar"

function Dashboard(){
    return(
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex flex-1 pt-20">
                <UserNavBar />

            </div>
            <Footer />
        </div>
    )
}

export default Dashboard