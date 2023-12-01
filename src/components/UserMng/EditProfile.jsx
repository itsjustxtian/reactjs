import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditProfile = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className='sign-up-container'>
            <h1>Edit Profile</h1>
            <br />
            <div>
                <div className='sign-up-leftt'>
                    <label>Company ID: </label>
                    <input
                        type="text"
                        placeholder="Company ID"
                    />
                </div>

                <div className='sign-up-leftt'>
                    <label>First Name: </label>
                    <input
                        type="text"
                        placeholder="First name"
                    />
                    <label>Last Name: </label>
                    <input
                        type="text"
                        placeholder="Last Name"
                    />
                    <label>Birthdate: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => handleDateChange(date)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText='Birthdate'
                        value={selectedDate}
                    />
                </div>

                <div className='CreateTicket'>
                    <label>Email: </label>
                    <input
                        type="email"
                        placeholder="Email"
                    />
                </div>

                <div className='sign-up-leftt'>
                    <label>Contact Number: </label>
                    <input
                        type="tel"
                        pattern='[0-9]*'
                        placeholder="Contact Number"
                    />
                </div>
            </div>
        </div>
    );
}

export default EditProfile;