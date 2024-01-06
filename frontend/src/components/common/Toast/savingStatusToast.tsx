import Spinner from "../Spinner/Spinner"
import { motion, AnimatePresence } from "framer-motion"

export default function SavingStatus({ saving }: { saving: boolean }) {
    return (
        <AnimatePresence initial={false}>
            {saving && (
                <motion.div
                    className="fixed top-10 right-0 z-50 mb-4 mr-4"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                >
                    <div className="rounded-lg py-2 px-3 shadow-lg bg-zinc-900">
                        <div className="flex flex-row items-center">
                            <div className="px-2 w-10">
                                <Spinner />
                            </div>
                            <p className="text-sm text-white">Guardando...</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
