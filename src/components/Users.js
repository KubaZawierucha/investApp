import React from 'react';

// class Users extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             users: [],
//             done: false
//         };
//         this.xhr = null;
//     }

//     componentDidMount() {
//         this.xhr = new XMLHttpRequest();
//         this.xhr.open('GET', 'http://localhost:50223/Users', true);
//         this.xhr.onload = (request) => {
//             if (request.status >= 200 && request.status < 400) {
//                 this.setState({
//                     users: this.xhr.responseText,
//                     done: true
//                 });
//             }
//         }
//         this.xhr.send();
//     }

//     componentWillUnmount() {
//         if (this.xhr && this.xhr.readyState != 4) {
//             this.xhr.abort();
//         }
//     }

//     render() {
//         if (!this.state.done) {
//             return (
//                 <div>
//                     Users Loading
//                 </div>
//             );
//         } else {
//             return (
//                 <div>
//                     Users: {this.state.users}
//                 </div>
//             )
//         }
//     }
// }

// export default Users;

class Users extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        users: []
      };
    }
  
    componentDidMount() {
        fetch("http://localhost:50223/Users")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        users: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }
  
    render() {
      const { error, isLoaded, users } = this.state;
      if (error) {
        return <div>Błąd: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Ładowanie...</div>;
      } else {
        return (
            <>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            User name: {user.login} ---------- User email: {user.email}
                        </li>
                    ))}
                </ul>
            </>
        );
      }
    }
  }

  export default Users;