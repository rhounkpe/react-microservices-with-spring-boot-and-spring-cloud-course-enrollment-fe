import {BehaviourSubject} from 'rxjs';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api/user/service/';
const currentUserSubject = new BehaviourSubject(JSON.parse(localStorage.getItem('currentUser')));

class UserService {
    get currentUserValue() {
        return currentUserSubject.value;
    }

    get currentUser() {
        return currentUserSubject.asObservable();
    }

    login(user) {
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };

        return axios.get(API_URL + 'user', {headers: headers}).then(response => {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            currentUserSubject.next(response.data);
        });
    }

    logout() {
        return axios.post(API_URL + 'logout', {})
            .then(response => {
                localStorage.removeItem('currentUser');
                currentUserSubject.next(null);
            }
        );
    }

    register(user) {
        return axios.post(API_URL + 'registration', JSON.stringify(user),
            {headers: {
                'Content-Type': 'application/json; charset-UTF-8'
            }
        });
    }
}

export default new UserService();