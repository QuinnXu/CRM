import React, { Component } from "react";
// import PageTitle from "../components/PageTitle";
// import Card from '../components/Card';
// import InputForm from '../components/InputForm';
import API from '../utilities/api';
import UserAPI from '../utils/API';

class ManagerTaskAssignment extends Component {
    state = {
        tasks: [],
        clients: [],
        users: []
    }
    UNSAFE_componentWillMount() {
        this.checkUsers();
        this.checkTasks();
        this.checkClients();
    }
    // get tasks
    checkTasks = () => {
        API.getTasks()
            .then(res =>
                this.setState({ tasks: res.data.tasks })
                )
                .catch(error => console.log("Check task error: " + error))
                let users = this.state.users;
                for (let i = 0; i < users.length; i++) {
                    this.matchUserToTask(users[i]._id, users[i].firstName, users[i].lastName);
                }
                // this.state.clients.forEach(function(client) {
                //     console.log(client);
                // });
    }
    // match user id with task user id and display user name
    matchUserToTask = (id, firstName, lastName) => {
        // console.log(id);
        // console.log(firstName);
        // console.log(lastName);
        let tasks = this.state.tasks;
        for (let i = 0; i < tasks.length; i++) {
            // if (!tasks[i].user[0]._id) {
            //     break;
            // }
            // console.log(tasks[i]._id);
            if (tasks[i].user[0]._id === id) {
                console.log("Task number " + tasks[i]._id + " has been assigned to " + firstName + " " + lastName)
            }
            // console.log(tasks[i]);
        }
        // console.log(id)
    }
    // get clients
    checkClients = () => {
        API.getClients()
            .then(res => 
                this.setState({ clients: res.data.clients })
                )
                .catch(error => console.log("Check task error: " + error))
    }
    // get users
    checkUsers = () => {
        UserAPI.getUsers()
            .then(res =>
                this.setState({ users: res.data })
                )
    }
    checkState = () => {
        // console.log(this.state.tasks);
        this.checkUsers();
        this.checkTasks();
        // console.log(this.state.clients);
        // console.log(this.state.users);
    }
        // assigned status
        // completion status
        // assigned date
        // last contacted date

        // get individual ids
        // get user associated with each task
            // get each individual ids
            // get clients associated with each task

    render() {
        return (
            <div>
                <button onClick={this.checkState}>
                Check tasks
                </button>
            </div>
        )
    }
}


export default ManagerTaskAssignment;