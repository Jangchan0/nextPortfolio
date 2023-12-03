'use client';
import { useState } from 'react';
import Image from 'next/image';
import developerImg from '../../public/developerProfile.png';

function Contact() {
    interface FormData {
        name: string;
        title: string;
        message: string;
    }

    const [formData, setFormData] = useState<FormData>({
        name: '',
        title: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSend = () => {
        // 여기서 서버로 데이터를 보내거나 다른 작업을 수행할 수 있습니다.
        console.log('Sending data:', formData);
        // 이 부분을 서버와의 통신으로 변경해야합니다.
    };

    return (
        <>
            <div className="flex grid-cols-2 justify-center item-center bg-slate-600">
                <div className="contactImg w-1/2">
                    <h2 className="text-3xl font-bold sm:text-6xl justify-center flex my-9">Contact</h2>
                    <div className="developerImg flex justify-center">
                        <Image src={developerImg} alt="developer profile" width={350} height={350} />
                    </div>
                </div>
                <div className="contactContants w-1/2 flex">
                    <div className="container mx-auto p-4 flex justify-center items-center">
                        {/* <h2 className="text-3xl font-semibold mb-4">Contact</h2> */}
                        <form className="container max-w-md flex flex-col ">
                            <div className="mb-8">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 bg-slate-400"
                                />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2  bg-slate-400"
                                />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2  bg-slate-400"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSend}
                                className="bg-blue-500 text-white p-2 rounded mt-6"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
