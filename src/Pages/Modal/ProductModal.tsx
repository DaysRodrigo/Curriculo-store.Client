export const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-[80%] h-full max-h-[60%]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;