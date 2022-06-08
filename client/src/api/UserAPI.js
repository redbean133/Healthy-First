import {useState, useEffect} from 'react';
import axios from 'axios';

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [history, setHistory] = useState([]);
    const [user, setUser] = useState();

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    });
                    setIsLogged(true);
                    setUser(res.data);
                    res.data.role == "manager" ? setIsManager(true) : setIsManager(false);
                } catch (error) {
                    alert(error.message);
                }
            };
            getUser();
        }
    }, [token])

    return {
        isLogged: [isLogged, setIsLogged],
        isManager: [isManager, setIsManager],
        history: [history, setHistory],
        user: [user, setUser],
    };
}

export default UserAPI;
 