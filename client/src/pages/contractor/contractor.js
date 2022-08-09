import './contractor.scss';
import React, { useState } from 'react';
import axios from 'axios';

export default function Contractor() {

    const [data, setData] = useState([]);

    const [countOutstanding, setCountOutstanding] = useState(0);

    const [numProperties, setNumProperties] = useState(0);

    const [priorityProperties, setPriorityProperties] = useState([]);

    const [contractor, setContractor] = useState();
    const [property, setProperty] = useState();
    const [descriptionText, setDescriptionText] = useState();
    const [requestStatus, setRequestStatus] = useState();

    const [contractorUsername, setContractorUsername] = useState();
    const [contractorPassword, setContractorPassword] = useState();
    const [contractorName, setContractorName] = useState();
    const [contractorPhone, setContractorPhone] = useState();
    const [hourlyRate, setHourlyRate] = useState();
    const [contractorStatus, setContractorStatus] = useState();

    const baseurl = 'http://localhost:4000/'

    const currentUsername = sessionStorage.getItem('username');



    // run on first load of page
    React.useEffect(() => {
        countOutstandingMaint();
        numOutstandingProperties();
        countPriorityProperties();
        fetchData();
    }, []);

    // run on button press
    function fetchData() {
        axios.get(baseurl + 'get-maintenance').then((response) => {
            setData(response.data);
        });
    }

    function countOutstandingMaint() {
        axios.get(baseurl + 'outstanding-maintenance').then((response) => {
            setCountOutstanding(response.data);
        });
    }

    function numOutstandingProperties() {
        axios.get(baseurl + 'outstanding-maintenance-properties').then((response) => {
            setNumProperties(response.data);
        });
    }

    function countPriorityProperties() {
        axios.get(baseurl + 'priority-maintenance-properties').then((response) => {
            setPriorityProperties(response.data);
        });
    }


    // run on button press
    function update(e, id) {
        axios.get(baseurl + 'update-date', { params: { curr_id: id } }).then((response) => {
            setData(response.data);
            countPriorityProperties();
            numOutstandingProperties();
            countOutstandingMaint();
            fetchData();
        });

        //this.forceUpdate();

        document.getElementById("test1").refresh();
        document.getElementById("test2").refresh();
        reload();
    }

    function deleteDate(e, id) {
        axios.get(baseurl + 'delete-date', { params: { curr_id: id } }).then((response) => {
            setData(response.data);
            countPriorityProperties();
            numOutstandingProperties();
            countOutstandingMaint();
            fetchData();
        });



        //this.forceUpdate();
        // document.getElementById("test1").refresh();
        // document.getElementById("test2").refresh();
        //reload();

    }

    const reload = () => {
        window.location.reload();
        countOutstandingMaint();
        numOutstandingProperties();
        countPriorityProperties();
        fetchData();
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

    const registerContractor = async e => {
        e.preventDefault();
        const res = await axios.post(baseurl + "make-contractor", {
            username: contractorUsername,
            password: contractorPassword,
            name: contractorName,
            phone: contractorPhone,
            hourly_rate: hourlyRate
        })

        if (res.data === "Information entered not correct.") {
            setContractorStatus(true);
        }
        else {
            setContractorStatus(false);
            reload();
        }
    }


    if (!data) return <p>No results</p>;

    var countOfReq;
    var countOfProp;


    return (

        <div>
            <h1>Maintenance Requests</h1>
        
            <h2>Welcome, {currentUsername}!</h2>
         

            <p>Review recent maintenance requests.</p>
         
            <br></br>
            <h3>Outstanding requests</h3>
            <p>There are {countOutstanding.length} outstanding maintenance requests to be completed at {numProperties.length} different properties.</p>
            <table class="table" id="test1">
                <thead>
                    <tr>
                        <th scope="col">Property</th>
                        <th scope="col">Number of Incomplete Requests</th>
                    </tr>
                </thead>
                <tbody>
                    {priorityProperties.map(d => (<tr><th scope="row">{d.property_id}</th><td>{d.num_incomplete}</td></tr>))}
                </tbody>
            </table>

            <br></br>
            <br></br>
            <h3>Maintenance History</h3>
            <table class="table" id="test2">
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
                    {data.map(d => (<tr key={d.maintenance_id}><th scope="row">{d.maintenance_id}</th><td>{d.contractor_id}</td><td>{d.property_id}</td><td>{d.description}</td>
                        <td>{d.date_submitted.substring(0, 10)}</td><td>{d.date_completed.substring(0, 10) === "1980-01-01" ? "Not completed" : d.date_completed.substring(0, 10)}</td>
                        <td><button type="button" class="btn btn-dark" onClick={(e) => { update(e, d.maintenance_id); reload(); }}>Complete</button></td>
                        <td><button type="button" class="btn btn-dark" onClick={(e) => { deleteDate(e, d.maintenance_id); reload(); }}>Delete</button></td></tr>))}
                </tbody>
            </table>


            <br></br>
            <br></br>
            <h3>Submit a maintenance request by adding contractor and property ID and description of the problem.</h3>
            <form onSubmit={registerRequest} id="formRequest">

                {/* Username input */}
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputContractor" class="col-form-label">Contractor ID</label>
                        <input type="number" class="form-control" id="inputContractor" value={contractor} onChange={e => setContractor(e.target.value)} />
                    </div>
                </div>

                {/* Password input */}
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputProperty" class="col-form-label">Property ID</label>
                        <input type="number" class="form-control" id="inputProperty" value={property} onChange={e => setProperty(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-form-label">Description</label>
                        <input type="text" class="form-control" id="inputDescription" value={descriptionText} onChange={e => setDescriptionText(e.target.value)} />
                    </div>
                </div>

                {/* Buttons */}
                <div class="d-grid gap-4 d-md-block mb-3 mt-4">
                    <button type="submit" class="btn btn-dark">Submit</button>
                </div>
                {requestStatus && <p>"Information entered not valid."</p>}

            </form>

            <br></br>
            <hr></hr>
            <br></br>
            <h3>Register a new contractor.</h3>
            <form onSubmit={registerContractor} id="formRequest">

                {/* Password input */}
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputUsername" class="col-form-label">Username</label>
                        <input type="text" class="form-control" id="inputUsername" value={contractorUsername} onChange={e => setContractorUsername(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-form-label">Password</label>
                        <input type="text" class="form-control" id="inputDescription" value={contractorPassword} onChange={e => setContractorPassword(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-form-label">Name</label>
                        <input type="text" class="form-control" id="inputDescription" value={contractorName} onChange={e => setContractorName(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-form-label">Phone Number</label>
                        <input type="text" class="form-control" id="inputDescription" value={contractorPhone} onChange={e => setContractorPhone(e.target.value)} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputDescription" class="col-form-label">Hourly Rate</label>
                        <input type="text" class="form-control" id="inputDescription" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                    </div>
                </div>

                {/* Buttons */}
                <div class="d-grid gap-4 d-md-block mb-3 mt-4">
                    <button type="submit" class="btn btn-dark">Submit</button>
                </div>
                {contractorStatus && <p>"Information entered not valid."</p>}


            </form>

        </div>
    );
}