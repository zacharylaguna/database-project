import './contractor.scss';
import React, { useState } from 'react';
import axios from 'axios';

export default function Contractor() {

    const [data, setData] = useState(null);

    const baseurl = 'http://localhost:4000/'

    // run on first load of page
    React.useEffect(() => {
        axios.get(baseurl + 'get-maintenance').then((response) => {
            setData(response.data);
        });
    }, []);

    // run on button press
    function fetchData() {
        axios.get(baseurl + 'get-maintenance').then((response) => {
            setData(response.data);
        });
    }

    // run on button press
    function update() {
        var userPrompt = prompt("Enter a Maintenance ID to mark as completed.");
        alert(userPrompt);
        axios.get(baseurl + 'update-date', { params: { curr_id: userPrompt } }).then((response) => {
            setData(response.data);
        });
        // this.forceUpdate();
    }

    const reload = ()=>{
        window.location.reload();
    }


    if (!data) return <p>No results</p>;

    return (
        <div>
            <h2>Maintenance Requests</h2>
            <p>Review recent maintenance requests.</p>
            <br></br>
            <button type="button" class="btn btn-dark" style={{ marginRight: '6px' }} onClick={fetchData}>Refresh data</button>
            <button type="button" class="btn btn-dark" onClick={() => { update(); reload();}}>Submit changes</button>
            <br></br>
            <br></br>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Request</th>
                        <th scope="col">Contractor</th>
                        <th scope="col">Property</th>
                        <th scope="col">Description</th>
                        <th scope="col">Date submitted</th>
                        <th scope="col">Date completed</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(d => (<tr><th scope="row">{d.maintenance_id}</th><td>{d.contractor_id}</td><td>{d.property_id}</td><td>{d.description}</td><td>{d.date_submitted.substring(0, 10)}</td><td>{d.date_completed.substring(0, 10) === "1980-01-01" ? "Not completed" : d.date_completed.substring(0, 10)}</td></tr>))}
                </tbody>
            </table>
        </div>
    );
}