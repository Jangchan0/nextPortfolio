'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import developerImg from '../../public/developerProfile.png';
import developerImgDark from '../../public/developerProfileDark.png';
import { useTheme } from 'next-themes';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <div className="contact-hologram cursor-default">
                <div className="contact-scanline" />
                <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="contactImg text-center lg:text-left">
                        <p className="contact-kicker">TRANSMISSION READY</p>
                        <h2 className="contact-title">Contact</h2>
                        <p className="contact-copy">
                            프로젝트, 협업, 채용 관련 이야기를 남겨주세요. 확인 후 가능한 빠르게 답변드리겠습니다.
                        </p>
                        <div className="contact-status-grid" aria-hidden="true">
                            <span>MAIL_LINK</span>
                            <span>ONLINE</span>
                            <span>RESPONSE</span>
                            <span>READY</span>
                        </div>
                        <div className="developerImg contact-avatar-frame mx-auto mt-8 transition-transform hover:rotate-[-2deg] lg:mx-0">
                            <Image
                                src={developerProfile}
                                alt="developer profile"
                                className="contact-avatar-image transition-transform hover:rotate-[-2deg]"
                                width={350}
                                height={350}
                            />
                        </div>
                    </div>
                    <div className="contactContants flex">
                        <div className="contact-form-panel">
                            <div className="mb-8 flex items-center justify-between gap-4">
                                <div>
                                    <p className="contact-kicker mb-2">SECURE MESSAGE</p>
                                    <h3 className="text-2xl font-black text-cyan-50">Send Signal</h3>
                                </div>
                                <span className="contact-terminal-line">ID: JCY-PORTFOLIO</span>
                            </div>

                            <form className="flex flex-col" ref={form} onSubmit={sendEmail}>
                                <div className="contact-field">
                                    <label htmlFor="name" className="contact-label">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="user_name"
                                        className="contact-input"
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="contact-field">
                                    <label htmlFor="email" className="contact-label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="user_email"
                                        className="contact-input"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="contact-field">
                                    <label htmlFor="message" className="contact-label">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="contact-input h-32"
                                        style={{ resize: 'none' }}
                                    />
                                </div>
                                <input
                                    className="contact-submit"
                                    type="submit"
                                    value={isSubmitting ? 'Sending...' : 'Send'}
                                    disabled={isSubmitting}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
