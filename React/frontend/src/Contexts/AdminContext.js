import { createContext } from "react";
import useAdminProvider from "../Hooks/useAdminProvider";

const Context = createContext({});

const AdminContext = (props) => {
    const adminProvider = useAdminProvider();

    return (
        <Context.Provider value={adminProvider}>
            {props.children}
        </Context.Provider>
    );
}

export default AdminContext;