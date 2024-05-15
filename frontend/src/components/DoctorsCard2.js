import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const DoctorsCard2 = ({ doctor, segment }) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const slots = doctor.workingDays;
  const timeSlotsPerDay = {};
  slots.map((slot) => {
    if (!timeSlotsPerDay[slot.Day]) {
      timeSlotsPerDay[slot.Day] = [];
    }
    timeSlotsPerDay[slot.Day].push(`${slot.startTime} - ${slot.endTime}`);
  })

  // const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
    // Reset selected time slot when day changes
    setSelectedTimeSlot('');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    setSelectedDay(day);
    if (timeSlotsPerDay[day] == undefined) {
      alert('Sir is not available on that day')
      setSelectedDay('')
      setSelectedDate(null)
    } else {
      setAvailableTimeSlots(timeSlotsPerDay[day]);
    }
  };

  const handleAppointment = async () => {
    const patientJSON = localStorage.getItem('Patient')
    const patient = JSON.parse(patientJSON);
    const patientId = patient._id;
    const appointment = { doctor_id: doctor._id, patient_id: patientId, day: selectedDay, time: selectedTimeSlot, department: segment, date: selectedDate }
    try {
      const response = await fetch("http://localhost:4000/appointment/createappointment", {
        method: "POST",
        body: JSON.stringify(appointment),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${patient.token}`
        },
      });
      const json = await response.json();
      if (json && Object.keys(json).length > 0) {
        alert("Appointment Booked");
      }
      navigate('/home')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="h-[32.625rem] w-[19.813rem] flex flex-col items-start justify-start min-w-[18.813rem] text-left text-[1.125rem] text-primary font-body">
      <img
        className="self-stretch flex-1  relative rounded-t-8xs rounded-b-none max-w-full overflow-hidden object-fit max-h-full"
        loading="lazy"
        alt=""
        src='/rectangle-20@2x.png'
      />
      <div className="self-stretch flex flex-col items-center justify-start py-[1.5rem] pr-[1.25rem] pl-[1.375rem] relative gap-[0.5rem]">
        <div className="w-full h-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] bg-lightsteelblue-100" />
        <div className="flex flex-row items-start justify-start py-[0rem] pr-[0.25rem] pl-[0.125rem]">
          <div className="relative leading-[140%] z-[1] font-bold">{doctor.Name}</div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[1rem]">

          <div className="p-4 z-[200] bg-gray-100 rounded-md ">
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 ">Select a date:</label>
              <DatePicker
                id="date"
                selected={selectedDate}
                onChange={handleDateChange}
                className="mt-1 px-3 py-2 block mx-auto border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
                dateFormat="MM/dd/yyyy"
                wrapperClassName="w-full"
                minDate={new Date()}
              />
              {/* <div className="z-[200] flex flex-col gap-4 ">
            <div className="flex flex-col gap-2 "> <label htmlFor="day">Select a day:</label>
              <select id="day" value={selectedDay} onChange={handleDayChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              >
                {Object.keys(timeSlotsPerDay).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select></div> */}

              {/* <div className="flex flex-col gap-2">
              <label htmlFor="timeSlot">Select a time slot:</label>
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                // onChange={handleTimeSlotChange}
                disabled={!selectedDay}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
              >
                <option value="">Select a time</option>
               {timeSlotsPerDay[selectedDay] && timeSlotsPerDay[selectedDay].map((timeslot)=>{
               return (<option key={timeslot} value={timeslot}>
                    {timeslot}
                </option>)
                })}
              </select>
            </div> */}

              {selectedDate !== null ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">Selected Day: {selectedDay}</p>
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Available Time Slots:</label>
                  <select
                    id="timeSlot"
                    className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
                    disabled={availableTimeSlots.length === 0}
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  >
                    {availableTimeSlots.length === 0 ? (
                      <option value="">No time slots available</option>
                    ) : (
                      <>
                        <option value="">Select a time slot</option>
                        {availableTimeSlots.map((timeSlot) => (
                          <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              ) : (


                <div className="mb-4">
                  <p className="text-sm text-gray-700">No Day selected</p>
                  <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Available Time Slots:</label>

                  <select
                    id="date"
                    className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
                    value=""
                    disabled
                  >
                    <option value="" disabled>Select a date first</option>
                    {/* Additional options can be added here */}
                    <option value="no-date" disabled>No date selected first</option>
                  </select></div>
              )}
            </div>


            <div className="flex flex-row items-center justify-center py-[0rem] pr-[0.875rem] pl-[0.687rem]">
              <div className="flex flex-row items-center justify-center gap-[1.25rem]">
                <img
                  className="h-[1.5rem] w-[1.5rem] relative min-h-[1.5rem] z-[0]"
                  alt=""
                  src="/vector-21.svg"
                />
                <img
                  className="h-[1.5rem] w-[1.5rem] relative min-h-[1.5rem] z-[0]"
                  alt=""
                  src="/vector-31.svg"
                />
                <img
                  className="h-[1.5rem] w-[1.5rem] relative min-h-[1.5rem] z-[0]"
                  alt=""
                  src="/vector-4.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <button className="cursor-pointer [border:none] py-[0.75rem] px-[1.25rem] bg-[transparent] self-stretch flex flex-row items-start justify-center relative  whitespace-nowrap " onClick={() => handleAppointment()}>
          <div className="h-full w-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] rounded-t-none rounded-b-8xs bg-primary hover:bg-primary-200" />
          <div className="relative text-[1rem] leading-[140%] font-body text-lightsteelblue-100  text-center inline-block min-w-[5.813rem] z-[1]" >
            Book Appointment
          </div>
        </button>
      </div>
    </div>
  )
}


export default DoctorsCard2;