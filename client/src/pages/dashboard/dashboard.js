// todo: 
// number of properties
// total rents
// total recent rents
// Add a new property & tenant
// create new maintenance request
// add payments received by tenant

// crud
// create property & tenant
// read properties (done)
// update rents (done)
// delete property & tenant - should only be done for mistakes

import './dashboard.scss';
import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {

    const [data, setData] = useState(null);

    const [properties, setProperties] = useState(null);

    const [payments, setPayments] = useState(null);

    const [post, setPost] = React.useState(null);

    // submitting maintenance request
    const [contractor, setContractor] = useState();
    const [property, setProperty] = useState();
    const [descriptionText, setDescriptionText] = useState();
    const [requestStatus, setRequestStatus] = useState();

    let token = sessionStorage.getItem("token");
    token = "";
    let username = sessionStorage.getItem("username");
    // username = 'inewton';

    const baseurl = 'http://localhost:4000/';



    const [tenant_username, setTenantUsername] = useState('');
    const [tenant_password, setTenantPassword] = useState('');
    const role = 'tenant';
    const [tenant_name, setTenantName] = useState('');
    const [tenant_phone, setTenantPhone] = useState('');
    const [payment_amount, setPaymentAmount] = useState('');
    const [payment_method, setPaymentMethod] = useState('');
    const [property_street, setPropertyStreet] = useState('');
    const [property_city, setPropertyCity] = useState('');
    const [property_state, setPropertyState] = useState('');
    const [property_zip, setPropertyZip] = useState('');
    const [property_cost, setPropertyCost] = useState('');
    const [newPropertyError, setNewPropertyError] = useState(false);

    const handleSubmit = event => {
        console.log('handleSubmit ran');
        event.preventDefault(); // 👈️ prevent page refresh

        // 👇️ access input values here
        console.log('tenant_username 👉️', tenant_username);
        console.log('tenant_password 👉️', tenant_password);
        console.log('tenant_name 👉️', tenant_name);
        console.log('tenant_phone 👉️', tenant_phone);
        console.log('payment_amount 👉️', payment_amount);
        console.log('payment_method 👉️', payment_method);
        console.log('property_street 👉️', property_street);
        console.log('property_city 👉️', property_city);
        console.log('property_state 👉️', property_state);
        console.log('property_zip 👉️', property_zip);
        console.log('property_cost 👉️', property_cost);

        // 👇️ api call here
        addProperty();


        // 👇️ clear all input values in the form
        if (!newPropertyError) {
            setTenantUsername('');
            setTenantPassword('');
            setTenantName('');
            setTenantPhone('');
            setPaymentAmount('');
            setPaymentMethod('');
            setPropertyStreet('');
            setPropertyCity('');
            setPropertyState('');
            setPropertyZip('');
            setPropertyCost('');

            reload();
        }
    };

    const deleteTenant = async e => {
        e.preventDefault();
        const username = e.nativeEvent.path[3].children[2].textContent;
        console.log(username);
        axios.post(baseurl + "delete-tenant", { "username": username })
            .then((response) => {
                console.log(response);
                fetchProperties();
            });
    }

    // run on first load of page
    React.useEffect(() => {
        fetchData();
        fetchProperties();
        fetchPayments();
    }, []);

    // run on button press
    function fetchData() {
        axios.get(baseurl + 'get-accounts').then((response) => {
            setData(response.data);
        });
    }

    // http request for properties
    function fetchProperties() {
        axios.get(baseurl + 'manager/properties/' + username, {
            headers: {
                token: token
            }
        }).then((response) => {
            setProperties(response.data);
        });
    }

    // http request for payments
    function fetchPayments() {
        axios.get(baseurl + 'manager/payments/' + username, {
            headers: {
                token: token
            }
        }).then((response) => {
            setPayments(response.data);
        });
        console.log('payment=' + payments);
    }

    function addProperty() {
        axios
            .post(baseurl + 'manager/add-property/' + username, {
                tenant_username: tenant_username,
                tenant_password: tenant_password,
                tenant_name: tenant_name,
                tenant_phone: tenant_phone,
                payment_amount: payment_amount,
                payment_method: payment_method,
                property_street: property_street,
                property_city: property_city,
                property_state: property_state,
                property_zip: property_zip,
                property_cost: property_cost
            })
            .then((response) => {
                console.log(response.data);
                if (response.data === 'error adding property') {
                    ;
                    setNewPropertyError(true);
                }
                console.log(newPropertyError);
                setPost(response.data);
            });
    }

    const registerRequest = async e => {
        e.preventDefault();
        const res = await axios.post(baseurl + "make-request", {
            contractor_id: contractor,
            property_id: property,
            description: descriptionText
        })

        if (res.data === "Information entered not correct.") {
            setRequestStatus(true);
        }
        else {
            setRequestStatus(false);
            reload();
        }
    }

    const reload = () => {
        window.location.reload();
        // fetchData();
        // fetchProperties();
        // fetchPayments();
    }

    if (!data || !properties || !payments) return (
        <div class="text-center mt-5">
            <div class="spinner-border spinner-border-lg" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div class="dashboard">
            <h1>Property Manager Dashboard</h1>
            <h4>Managed properies <button type="button" class="btn bg-transparent rounded-pill" onClick={reload}><i class="bi bi-arrow-clockwise"></i></button></h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Address</th>
                        <th scope="col">Tenant Name</th>
                        <th scope="col">Username</th>
                        <th scope="col"></th>

                    </tr>
                </thead>
                <tbody>
                    {properties.map(p => (
                        <tr>
                            <td>
                                {p.street}
                                <br></br>
                                {p.city}, {p.state} {p.zip}
                            </td>
                            <td>{p.name}</td>
                            <td>{p.username}</td>
                            <td><button type="button" onClick={deleteTenant} class="btn bg-transparent rounded-pill"><i class="bi bi-trash"></i></button></td>


                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            <form onSubmit={handleSubmit}>
                <h1 class="h3">Add a new property</h1>
                {newPropertyError && <p class="text-danger"><strong>Unable to add new property.</strong> Property or Tenant already exists</p>}

                <div class="row">
                    <div class="col-sm-6">
                        <label>tenant username</label>
                        <input
                            id="tenant_username"
                            name="tenant_username"
                            type="text"
                            class="form-control"
                            onChange={event => setTenantUsername(event.target.value)}
                            value={tenant_username}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>tenant password</label>
                        <input
                            id="tenant_password"
                            name="tenant_password"
                            type="text"
                            class="form-control"
                            value={tenant_password}
                            onChange={event => setTenantPassword(event.target.value)}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>tenant name</label>
                        <input
                            id="tenant_name"
                            name="tenant_name"
                            type="text"
                            class="form-control"
                            onChange={event => setTenantName(event.target.value)}
                            value={tenant_name}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>tenant phone</label>
                        <input
                            id="tenant_phone"
                            name="tenant_phone"
                            type="text"
                            class="form-control"
                            onChange={event => setTenantPhone(event.target.value)}
                            value={tenant_phone}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>payment amount</label>
                        <input
                            id="payment_amount"
                            name="payment_amount"
                            type="text"
                            class="form-control"
                            onChange={event => setPaymentAmount(event.target.value)}
                            value={payment_amount}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>payment method</label>
                        <input
                            id="payment_method"
                            name="payment_method"
                            type="text"
                            class="form-control"
                            onChange={event => setPaymentMethod(event.target.value)}
                            value={payment_method}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>property street</label>
                        <input
                            id="property_street"
                            name="property_street"
                            type="text"
                            class="form-control"
                            onChange={event => setPropertyStreet(event.target.value)}
                            value={property_street}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>property city</label>
                        <input
                            id="property_city"
                            name="property_city"
                            type="text"
                            class="form-control"
                            onChange={event => setPropertyCity(event.target.value)}
                            value={property_city}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>property state</label>
                        <input
                            id="property_state"
                            name="property_state"
                            type="text"
                            class="form-control"
                            onChange={event => setPropertyState(event.target.value)}
                            value={property_state}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>property zip</label>
                        <input
                            id="property_zip"
                            name="property_zip"
                            type="text"
                            class="form-control"
                            onChange={event => setPropertyZip(event.target.value)}
                            value={property_zip}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label>property cost</label>
                        <input
                            id="property_cost"
                            name="property_cost"
                            type="text"
                            class="form-control"
                            onChange={event => setPropertyCost(event.target.value)}
                            value={property_cost}
                        />
                    </div>
                </div>

                <button type="submit" class="btn btn-dark mt-4"><i class="bi bi-house-door-fill"></i> Add a property</button>

            </form>


            <br></br>
            <br></br>

            <h4>Tenant payment history <button type="button" class="btn bg-transparent rounded-pill" onClick={fetchPayments}><i class="bi bi-arrow-clockwise"></i></button></h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Date paid</th>
                        <th scope="col">Tenant</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Method</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr>
                            <th scope="row">{p.date_paid}</th>
                            <td>{p.name}</td>
                            <td>${p.amount}</td>
                            <td style={{ "text-transform": "capitalize" }}>{p.payment_method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>











            <h3> Submit a maintenance request by adding contractor and property ID and description of the problem.</h3>
            <form onSubmit={registerRequest} id="formRequest">

                {/* Username input */}
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputContractor" class="col-sm-2 col-form-label">Contractor ID</label>
                        <input type="number" class="form-control" id="inputContractor" value={contractor} onChange={e => setContractor(e.target.value)} />
                    </div>
                </div>

                {/* Password input */}
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputProperty" class="col-sm-2 col-form-label">Property ID</label>
                        <input type="number" class="form-control" id="inputProperty" value={property} onChange={e => setProperty(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-sm-2 col-form-label">Description</label>
                        <input type="text" class="form-control" id="inputDescription" value={descriptionText} onChange={e => setDescriptionText(e.target.value)} />
                    </div>
                </div>

                {/* Buttons */}
                <div class="d-grid gap-4 d-md-block mb-3 mt-4">
                    <button type="submit" class="btn btn-dark">Submit</button>
                </div>
                {requestStatus && <p>"Information entered not valid."</p>}


            </form>
        </div>
    );
}