import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topmost from "../components/Topmost";
import Navbar from "../components/Navbar";
import FrameComponent6 from "../components/FrameComponent6";
import FrameComponent5 from "../components/FrameComponent5";
import FrameComponent4 from "../components/FrameComponent4";
import DoctorsCard from "../components/DoctorsCard";
import SmallNews from "../components/SmallNews";
import GroupComponent3 from "../components/GroupComponent3";
import GroupComponent2 from "../components/GroupComponent2";
import GroupComponent1 from "../components/GroupComponent1";
import GroupComponent from "../components/GroupComponent";
import Footer from "../components/Footer";

const UserView = () => {
    const navigate = useNavigate();

    const onMeddicalText1Click = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const onMeddicalTextClick = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const onAppointmentTextClick = useCallback(() => {
        navigate("/appointment");
    }, [navigate]);

    const onDoctorsText1Click = useCallback(() => {
        navigate("/doctors");
    }, [navigate]);

    const onServicesText1Click = useCallback(() => {
        // Please sync "Services" to the project
    }, []);

    const onAboutUsText2Click = useCallback(() => {
        navigate("/about-us");
    }, [navigate]);



    // Function to handle rescheduling an appointment
    const handleReschedule = (id) => {
        // Implement logic to reschedule appointment
        console.log("Reschedule appointment with ID:", id);
    };

    // Function to handle cancelling an appointment

    const handleCancel = async (appointment) => {
        try {
            const patientJSON = localStorage.getItem("Patient");
            const patient = JSON.parse(patientJSON);
            const cancelappointment = { _id: appointment._id };
            const response = await fetch("http://localhost:4000/appointment/cancelappointment", {
                method: "DELETE",
                body: JSON.stringify(cancelappointment),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${patient.token}`,
                },
            });
            const json = await response.json();
            // Update appointments state after successful cancellation
            if (json.success) {
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((item) => item._id !== appointment._id)
                );
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const [appointments, setAppointments] = useState([]);

    const handleMyAppointments = async () => {
        const patientJSON = localStorage.getItem("Patient");
        const patient = JSON.parse(patientJSON);
        const patientId = patient._id;
        const myappointment = { patient_id: patientId };
        console.log(patientId, patient)
        try {
            const response = await fetch(`http://localhost:4000/appointment/myappointments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${patient.token}`,
                },
            });
            const json = await response.json();
            setAppointments(json.appointments); // Assuming the response contains appointments array
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        handleMyAppointments(); // Fetch appointments when component mounts
    }, []); // Empty dependency array ensures the effect runs only once


    return (
        <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
            <div className="w-[9.813rem] h-[6.438rem] relative bg-silver-200 hidden" />
            <Topmost
                everydayDebugCommit="unset"
                frameDivDebugCommit="unset"
                onMeddicalText1Click={onMeddicalText1Click}
            />
            <Navbar />
            <div className="container mx-auto mt-8">
                <h1 className="text-3xl font-semibold mb-4 text-primary">Your Appointments</h1>
                <div className="grid grid-cols-1 gap-4">
                    {appointments && appointments.map((appointment) => (
                        <div key={appointment.id} className="bg-lightsteelblue-100 rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-2 text-primary">{appointment.doctorName}</h2>
                            <p className="text-gray-600 mb-2">Date: {appointment.date}</p>
                            <p className="text-gray-600 mb-4">Time: {appointment.time}</p>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleReschedule(appointment.id)}
                                    className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Reschedule
                                </button>
                                <button
                                    onClick={() => handleCancel(appointment)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                    {!appointments && <p>No appointments found.</p>}
                </div>
            </div>

            <Footer
                onMeddicalTextClick={onMeddicalTextClick}
                onAppointmentTextClick={onAppointmentTextClick}
                onDoctorsText1Click={onDoctorsText1Click}
                onServicesText1Click={onServicesText1Click}
                onAboutUsText1Click={onAboutUsText2Click}
            />
        </div>
    );
};

export default UserView;
