import React, { useMemo, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function StyledDropzone(props) {
    const [videoSrc, seVideoSrc] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const url = URL.createObjectURL(acceptedFiles[0]);
        seVideoSrc(url);
        // Do something with the files
        props.onDrop(acceptedFiles);
    }, [])
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({ 
        accept: { 'video/*': [] },
        maxFiles: 1,
        onDrop
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <div className="StyleDropzone">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <div className='video-container'>
                {videoSrc && (
                    <video
                        width="100%"
                        height="100%"
                        controls
                        src={videoSrc}
                    />
                )}
            </div>

            {/* <div className="VideoInput_footer">{videoSrc || "Nothing selectd"}</div> */}
        </div>
    );
}
export default StyledDropzone;