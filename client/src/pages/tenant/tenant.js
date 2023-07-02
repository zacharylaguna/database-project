import './tenant.scss';
import React, { useState } from 'react';
import axios from 'axios';

export default function Tenant() {
    const [data, setData] = useState();

    const basePath = 'http://3.17.248.106:4000/';

    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");

    // run on first load of page
    React.useEffect(() => {
        axios.get(basePath + 'get-tenant/' + username, {
            headers: {
                token: token
            }
        }).then((response) => {
            setData(response.data);
        });
    });

    console.log(data);
    if (!data) return (
        <div class="text-center mt-5">
            <div class="spinner-border spinner-border-lg" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    );

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

            <h6>Current rent agreement</h6>
            <p>${data[1].monthly_cost} per month</p>

            <br></br>

            <h4>Payment history</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Date paid</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Method</th>
                    </tr>
                </thead>
                <tbody>
                    {data[2].map(p => (
                        <tr>
                            <th scope="row">{p.date_paid}</th>
                            <td>${p.amount}</td>
                            <td>{p.payment_method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}