import React from 'react';

type AvatarWithUploadButtonProps = {
    imageUrl?: string;
    className?: string;
    isEditable?: boolean;
    onClick?: () => void;
};

const AvatarWithUploadButton = ({ imageUrl, isEditable, className, onClick }: AvatarWithUploadButtonProps) => {
    return (
        <div className={`relative rounded-full ${className}`}>
            <img className="w-20 h-20 rounded-full bg-cover bg-center" src={imageUrl || '/assets/images/frog-avatar2.png'} alt="Profile Image" />

            {isEditable && (
                <button onClick={onClick} className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/80 rounded-full">
                    <span className="icon-upload text-white text-2xl" />
                </button>
            )}
        </div>
    );
};

export default AvatarWithUploadButton;
