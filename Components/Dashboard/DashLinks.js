import { FiHome, FiImage, FiUsers } from 'react-icons/fi';

const Links = [
    {
        name: "Home",
        path: "/dashboard",
        roles: ["admin", "user"],
        icon: FiHome
    },
    {
        name: "Albums",
        path: "/dashboard/albums",
        roles: ["admin", "user"],
        icon: FiImage
    },
    {
        name: "Users",
        path: "/dashboard/users",
        roles: ["admin"],
        icon: FiUsers
    }
]

export default Links;