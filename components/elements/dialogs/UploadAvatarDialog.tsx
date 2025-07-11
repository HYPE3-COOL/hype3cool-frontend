'use client';

import React, { Fragment, useEffect, useState } from 'react';
import BaseDialog from './BaseDialog';

import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import { useCreateAgent } from '@/components/agent/provider/CreateAgentProvider';

import { useSelector, IRootState } from '@/store';
import { setProfilePic } from '@/store/slices/agent';

type UploadAvatarDialogProps = {
    message: string;
    open: any;
    setOpen: React.Dispatch<any>;
    callback: () => Promise<void>;
    confirmText?: string;
    cancelText?: string;
};

export default function UploadAvatarDialog({ message, confirmText = 'Confirm', cancelText = 'Cancel', open, setOpen, callback }: UploadAvatarDialogProps) {
    const { data: session, status } = useSession();
    // const { profilePic, setProfilePic } = useCreateAgent();

    const { profilePic } = useSelector((state: IRootState) => state.agent);

    // upload image
    const [files, setFiles] = useState<{ preview: string }[]>([]);

    // initialize files to empty array when dialog is opened
    useEffect(() => {
        if (open) {
            setFiles([]);
        }
    }, [open]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            );
        },
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (session?.user?.id == undefined) return;

        // if no file selected, update user with default profile pic selected
        if (!files || files.length == 0) {
            // check if user has selected an image from default profile pics
            // if (selectedPic == -1) return showMessage('Please select image first', 'error');
            // await dispatch(updateProfile(session.user.id, { image: DEFAULT_USER_PROFILE_PIC[selectedPic] }));
        }

        if (isUploading) return;

        try {
            setIsUploading(true);

            for (let index = 0; index < files.length; index++) {
                const file = files[index];

                const formData = new FormData();
                formData.append('file', file as any);

                // TODO: protect this endpoint by adding a token
                const response = await axios.post(process.env.NEXT_PUBLIC_API_HOST! + `/upload`, formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                        Authorization: `Bearer ${session?.backendTokens?.accessToken}`,
                    },
                });

                if (response.data && response.data.status == 'success') {
                    const { data } = response.data;
                    setProfilePic(data.url);
                    setFiles([]);
                    setOpen(false);
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <BaseDialog open={open} setOpen={setOpen}>
            <div className="p-4 md:p-5 text-center">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />

                    {files.length > 0 ? (
                        <div className="w-full h-[200px] relative bg-slate-400/5 rounded-lg shadow-inner border border-[#92f7cb]/5 p-2.5">
                            <div className="h-full flex flex-col items-center justify-center bg-slate-400/5 rounded-lg border border-dashed border-white/30">
                                <img
                                    src={files[0].preview}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        maxWidth: `180px`,
                                        maxHeight: `180px`,
                                    }}
                                    onLoad={() => {
                                        URL.revokeObjectURL(files[0].preview);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-[200px] relative bg-slate-400/5 rounded-lg shadow-inner border border-[#92f7cb]/5 p-2.5">
                            <div className="h-full flex flex-col items-center justify-center bg-slate-400/5 rounded-lg border border-dashed border-white/30">
                                <div className="w-[60px] h-[60px] rounded-[5px] border border-white/20 justify-center items-center flex flex-col">
                                    <div className="w-[30px] h-[30px] relative">
                                        <div className="w-[30px] h-[1.80px] left-[14.10px] top-[30px] absolute origin-top-left -rotate-90 bg-white/20" />
                                        <div className="w-[30px] h-[1.80px] left-0 top-[14.10px] absolute bg-white/20" />
                                    </div>
                                </div>
                                <div className="text-white/50 text-lg font-semibold font-figtree mt-[22px]">Click or Drag-and-Drop</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button type="button" data-modal-hide="popup-modal" className="hype3-btn-secondary hype3-bg-light-to-teal" onClick={handleUpload} disabled={isUploading || files.length == 0}>
                        {confirmText}
                    </button>

                    <button type="button" data-modal-hide="popup-modal" className="hype3-btn-secondary hype3-bg-light-to-teal" onClick={() => setOpen(false)} disabled={isUploading}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
}
