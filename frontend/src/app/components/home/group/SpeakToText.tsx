"use client"

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Button from "../../common/Button/Button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect, useState } from "react";
import { GptResponse, IList } from "../../../../../types";
import Spinner from "../../common/Spinner/Spinner";
import CustomModal from "../../common/Modals/Modal";
import ItemsForm from "./ItemsForm";
import VoiceAnimation from "../../common/VoiceAnimation/voice";
import { createToast } from "@/lib/common";

interface ISpeakToTextProps {
    lists: IList[]
}

export default function SpeakToText({ lists }: ISpeakToTextProps) {
    const [loading, setLoading] = useState(false);
    const [gptResponse, setGptResponse] = useState<GptResponse>();
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showTalkModal, setShowTalkModal] = useState(false);
    const {
        transcript,
        finalTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        const callOpenAIApi = async () => {
            try {
                const response = await fetch("/api/speak", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: finalTranscript,
                        lists: lists
                    })
                });

                const data = await response.json();
                return data;
            } catch (error) {
                throw error;
            }
        }

        const fetchData = async () => {
            if (finalTranscript.length > 0) {
                setLoading(true);
                try {
                    const data = await callOpenAIApi();
                    setGptResponse(data);
                    setShowTalkModal(false);
                    setShowItemsModal(true);
                } catch (error) {
                    createToast({
                        message: "Error al procesar el mensaje",
                        toastType: "error"
                    });
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchData();
    }, [finalTranscript, lists]);


    const handleListen = async () => {
        if (!listening) {
            SpeechRecognition.startListening({
                continuous: false,
                language: 'es-CL'
            })
        } else {
            SpeechRecognition.abortListening();
        }
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesnt support speech recognition.</span>;
    }

    return (
        <>
            <Button type="submit">
                <div className="flex items-center justify-center" onClick={() => setShowTalkModal(true)}>
                    <MicrophoneIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Comandos de voz</span>
                </div>
            </Button >
            <CustomModal isOpen={showItemsModal} onClose={() => setShowItemsModal(false)}>
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                    <h2 className="text-xl font-bold mb-4 text-center">¿Estos son los items que quieres agregar?</h2>
                    <p className="text-sm mb-4 text-center">Puedes modificarlos en caso de que te haya entendido mal</p>
                    {gptResponse && <ItemsForm items={gptResponse.items} lists={lists} closeModal={() => setShowItemsModal(false)} />}
                </div>
            </CustomModal >


            <CustomModal isOpen={showTalkModal} onClose={() => setShowTalkModal(false)}>
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                    <h2 className="text-xl font-bold mb-2 text-center">Habla conmigo</h2>
                    <p className="text-sm mb-4 text-center">Puedes decirme que quieres agregar a tus listas</p>
                    <p className="text-sm mb-4 text-center font-semibold">&ldquo;Agregar tres tomates, 2 cajas de leche y 1 kilo de carne a la lista de compras&rdquo;</p>
                    {browserSupportsSpeechRecognition && (
                        <>
                            {
                                !listening ? (
                                    <div className="flex flex-col items-center">
                                        <Button type="circle" onClick={handleListen}>
                                            {loading ? <Spinner /> : <MicrophoneIcon className="h-6 w-6" />}
                                        </Button >
                                        {!loading && <small className="text-xs text-center mt-2">Empezar a hablar</small>}
                                    </div>
                                ) : <VoiceAnimation />
                            }
                        </>
                    )
                    }
                </div>
            </CustomModal >
        </>
    )
}
