import './dashboard.scss';
import React,  { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {

    const [data, setData] = useState(null);

    const [properties, setProperties] = useState(null);

    const baseurl = 'http://localhost:4000/'

    // run on first load of page
    React.useEffect(() => {
        fetchData();
    }, []);

    // run on button press
    function fetchData() {
        axios.get(baseurl + 'get-accounts').then((response) => {
            setData(response.data);
        });
    }

    // run on first load of page
    React.useEffect(() => {
        fetchProperties();
    }, []);

    // run on button press
    function fetchProperties() {
        axios.get(baseurl + 'get-properties/inewton').then((response) => {
            setProperties(response.data);
        });
    }

    if (!data) return "no data";
    if (!properties) return "no data";

    return (
        <div class="dashboard">
            <h2>Dashboard</h2>
            {/* <button onClick={fetchData}>fetchData</button>
            <div>
                <p>
                    {data.map(d=> (<li>{d.username}</li>))}
                </p>
            </div> */}
            <button type="button" class="btn btn-dark" onClick={fetchProperties}>fetchProperties</button>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">street</th>
                        <th scope="col">city</th>
                        <th scope="col">state</th>
                        <th scope="col">zip</th>
                        <th scope="col">name</th>
                        <th scope="col">username</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(p => (<tr><th scope="row">{p.street}</th><td>{p.city}</td><td>{p.state}</td><td>{p.zip}</td><td>{p.name}</td><td>{p.username}</td></tr>))}
                </tbody>
            </table>
        </div>
    );
}