import './tenant.scss';
import React, { useState } from 'react';
import axios from 'axios';

export default function Tenant() {
    const [data, setData] = useState(null);

    const basePath = 'http://localhost:4000/';
    const tenantUsername = 'cdarwin';

    // run on first load of page
    React.useEffect(() => {
        axios.get(basePath + 'get-tenant/' + tenantUsername).then((response) => {
            setData(response.data);
        });
    }, []);

    
    console.log(data);
    if (!data) return (<p>No data</p>);

    return (
        <div>
            <h1>Welcome, {data[0].name}!</h1>

            <h4>Account</h4>
            <h6>Name</h6>
            <p>{data[0].name}</p>

            <h6>Username</h6>
            <p>{data[0].username}</p>
            
            <br></br>
            <h4>Property details</h4>
            <h6>Address</h6>
            <p>{data[1].street}<br></br>{data[1].city}, {data[1].state} {data[1].zip}</p>

            <h6>Payment</h6>
            <p>${data[1].monthly_cost} per month</p>
        </div>
    );
}