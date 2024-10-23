export default {
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },
    logout() {
        localStorage.removeItem('isAuthenticated');
    }
};