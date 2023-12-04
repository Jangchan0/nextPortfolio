'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import developerImg from '../../public/developerProfile.png';
import developerImgDark from '../../public/developerProfileDark.png';
import { useTheme } from 'next-themes';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from '../../config/index';

function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme } = useTheme();

    const form = useRef<HTMLFormElement | null>(null);

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }
        if (form.current) {
            const formData = new FormData(form.current);
            const name = formData.get('user_name') as string;
            const email = formData.get('user_email') as string;
            const message = formData.get('message') as string;

            if (!name || !email || !message) {
                toast.error(' 내용을 작성해주세요.', {
                    position: toast.POSITION.TOP_CENTER,
                    icon: '🚫',
                    hideProgressBar: true,
                    className: 'toast-message',
                });
                return;
            }

            try {
                setIsSubmitting(true);

                await emailjs.sendForm(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
                    form.current,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
                );

                form.current?.reset();

                toast.success('소중한 의견 감사드립니다.', {
                    position: toast.POSITION.TOP_CENTER,
                    icon: '✉️',
                    hideProgressBar: true,
                    className: 'toast-message',
                });
            } catch (error) {
                toast.error('메일 전송에 실패하였습니다. ', {
                    position: toast.POSITION.TOP_CENTER,
                    icon: '🥲',
                    hideProgressBar: true,
                    className: 'toast-message',
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const developerProfile = theme === 'light' ? developerImgDark : developerImg;

    return (
        <>
            <ToastContainer />
            <div className="md:flex sm:flex-row sm:item-center justify-center item-center bg-primary rounded-md py-10 cursor-default">
                <div className="contactImg md:w-1/2 sm:w-full shadow-lg text-center">
                    <h2 className="text-3xl font-bold sm:text-6xl justify-center flex my-9">Contact</h2>
                    <p className="text-md font-bold sm:text-md justify-center my-9 ">thank you!</p>
                    <div className="developerImg flex justify-center mb-6 transition-transform  hover:rotate-[-2deg]">
                        <Image
                            src={developerProfile}
                            alt="developer profile"
                            className="transition-transform hover:rotate-[-2deg]"
                            width={350}
                            height={350}
                        />
                    </div>
                </div>
                <div className="contactContants md:w-1/2 sm:w-full flex">
                    <div className="container mx-auto p-4 flex justify-center items-center">
                        <form className="container max-w-md flex flex-col" ref={form} onSubmit={sendEmail}>
                            <div className="mb-8">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="user_name"
                                    className="w-full border rounded p-2 bg-slate-200 dark:bg-slate-400"
                                />
                            </div>
                            <div className="mb-8">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 dark:text-gray-100  text-sm font-bold mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="user_email"
                                    className="w-full border rounded p-2  bg-slate-200 dark:bg-slate-400"
                                />
                            </div>
                            <div className="mb-8">
                                <label
                                    htmlFor="message"
                                    className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    className="w-full h-28 border rounded p-2  bg-slate-200 dark:bg-slate-400"
                                    style={{ resize: 'none' }}
                                />
                            </div>
                            <input
                                className="bg-blue-500 text-white p-2 rounded mt-4  active:bg-blue-700 cursor-pointer"
                                type="submit"
                                value="Send"
                                disabled={isSubmitting}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;

// 'service_k0ba4dp',
// 'template_i2yl3l8',
// form.current,
// 'Dw8vgZag-8fmTAgt7'
