import React,{ useState} from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function Aibox() {
    const genAI = new GoogleGenerativeAI('AIzaSyDa-KH25ASikWcSWQzPhTfwGzzocizPz7Q');
    const [search,setSearch ] = useState('')
    const [response,setResponse ] = useState('')
    const [loading,setLoading ] = useState(false);
    const aisearch = async()=>{
        setLoading(true)
        setResponse('')
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})
        const prompt = `${search}- these are the symptoms of a patient. The hospital has the following branches in it -{Medicines,Bones, Dermatology,Pulmonology, Gynaecology,Renal Medicine,Gastroenterology, Urology, Dermatology,Neurology}. Suggest the patient the most appropriate branch in which he should book an appointment. The response should have only the name of the branch and it should be one from the above list. If the patient has given invalid prompt then address the problem within 7-8 words`
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text)
        setLoading(false);
        setSearch('');
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResponse('');
    }
  return (
    <div className='flex flex-col mx-auto border-blue-400 border-4 bg-slate-200 w-3/5 rounded-lg mb-8'>
        <h2 className='text-xl text-secondary font-body'>Enter your symptoms and Find the Right Department for you</h2>
        <div className='flex flex-row justify-center'>
           <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className='w-1/2 h-7'/>
           <button onClick={aisearch} className='cursor-pointer w-1/12'>Search</button>
        </div>
        <h4 className='text-black'>Suggested Department: {response}</h4>
    </div>
  )
}

export default Aibox;