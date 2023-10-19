"use client"

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Button from "../../common/Button/Button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect, useState } from "react";
import { GptItem, GptResponse, IList } from "../../../../../types";
import Spinner from "../../common/Spinner/Spinner";
import CustomModal from "../../common/Modals/Modal";
import ItemsForm from "./ItemsForm";


interface ISpeakToTextProps {
    lists: IList[]
}

export default function SpeakToText({ lists }: ISpeakToTextProps) {
    const [microphone, setMicrophone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gptResponse, setGptResponse] = useState<GptResponse>();
    const [showModal, setShowModal] = useState(false);
    const {
        transcript,
        finalTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        const callOpenAIApi = async () => {
            const response = await fetch("/api/speak", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: finalTranscript,
                    lists: lists
                })
            })
            const data = await response.json()
            return data
        }

        if (finalTranscript.length > 0) {
            setLoading(true)
            // callOpenAIApi().then(data => {
            //     setGptResponse(data)
            //     setLoading(false)
            //     setShowModal(true)
            // })
            const items = { "items": [{ "name": "palta", "list": "Supermercado", "quantity": 1 }, { "name": "tomate", "list": "Supermercado", "quantity": 1 }, { "name": "lechuga", "list": "Supermercado", "quantity": 1 }] }
            setGptResponse(items)
            setLoading(false)
            setShowModal(true)
        }
    }, [finalTranscript, lists])

    const handleListen = async () => {
        if (!listening) {
            setMicrophone(true);
            SpeechRecognition.startListening({
                continuous: false,
                language: 'es-CL'
            })
        } else {
            setMicrophone(false);
            SpeechRecognition.abortListening();
        }
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesnt support speech recognition.</span>;
    }

    return (
        <>
            <Button type="submit">
                {
                    loading ? <Spinner /> : (
                        <div
                            className="flex items-center justify-center gap-2"
                            onClick={handleListen}
                        >
                            <MicrophoneIcon className="h-5 w-5" />
                            <span>{listening ? "Parar" : "Comandos rápidos"}</span>
                        </div>
                    )
                }
            </Button >
            {
                microphone ? (
                    <div className="p-2 bg-zinc-800 rounded-md text-sm w-full">
                        <p>{transcript}</p>
                    </div>
                ) : null
            }
            <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                    <h2 className="text-xl font-bold mb-4 text-center">¿Estos son los items que quieres agregar?</h2>
                    <p className="text-sm mb-4 text-center">Puedes modificarlos en caso de que te haya entendido mal</p>
                    {gptResponse && <ItemsForm items={gptResponse.items} lists={lists} closeModal={() => setShowModal(false)} />}
                </div>
            </CustomModal >
        </>
    )
}
