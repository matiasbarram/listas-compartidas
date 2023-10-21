"use client"

import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Button from "../../common/Button/Button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect, useState } from "react";
import { IList } from "../../../../../types";
import Spinner from "../../common/Spinner/Spinner";
import CustomModal from "../../common/Modals/Modal";
import ItemsForm from "./ItemsForm";
import VoiceAnimation from "../../common/VoiceAnimation/voice";
import { createToast } from "@/lib/common";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { openAICreateItems } from "@/lib/actions/item/items";

interface ISpeakToTextProps {
    lists: IList[]
}

export default function SpeakToText({ lists }: ISpeakToTextProps) {
    const params = useParams();
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showTalkModal, setShowTalkModal] = useState(false);
    const {
        transcript,
        finalTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const { mutate: callOpenAIApi, isLoading, data: gptResponse } = useMutation({
        mutationKey: ["speak", params.slug],
        mutationFn: () => openAICreateItems({ finalTranscript, lists }),
        onSuccess() {
            setShowTalkModal(false);
            setShowItemsModal(true);

        },
        onError() {
            createToast({
                message: "Error al procesar el mensaje",
                toastType: "error"
            });
        },
    })

    useEffect(() => {
        if (finalTranscript.length > 0) {
            callOpenAIApi();
        }
    }, [finalTranscript, callOpenAIApi])

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

    if (!browserSupportsSpeechRecognition) return

    return (
        <>
            <Button type="submit">
                <div className="flex items-center justify-center" onClick={() => setShowTalkModal(true)}>
                    <MicrophoneIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Comandos de voz</span>
                </div>
            </Button >
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
                                            {isLoading ? <Spinner /> : <MicrophoneIcon className="h-6 w-6" />}
                                        </Button >
                                        {!isLoading && <small className="text-xs text-center mt-2">Empezar a hablar</small>}
                                    </div>
                                ) : <VoiceAnimation />
                            }
                        </>
                    )
                    }
                </div>
            </CustomModal >

            <CustomModal isOpen={showItemsModal} onClose={() => setShowItemsModal(false)}>
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                    <h2 className="text-xl font-bold mb-4 text-center">¿Estos son los items que quieres agregar?</h2>
                    <p className="text-sm mb-4 text-center">Puedes modificarlos en caso de que te haya entendido mal</p>
                    {gptResponse && <ItemsForm items={gptResponse.items} lists={lists} closeModal={() => setShowItemsModal(false)} />}
                </div>
            </CustomModal >
        </>
    )
}
