import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import { useAuth } from "util/auth";
import { useMusic, createMusic, updateMusic } from "util/db";
import StyledDropzone from "components/StyledMusicDropzone";

async function getPresignedRequestData(selectedFile) {
    const filename = encodeURIComponent(selectedFile.name);
    const fileType = encodeURIComponent(selectedFile.type);

    const res = await fetch(
        `/api/upload-url?file=${filename}&fileType=${fileType}`
    );
    const data = await res.json(); //{ post, videoUrl }
    return data;
}

async function uploadFileToS3(post, file) {
    const formData = new FormData()
    Object.entries({ ...post.fields }).forEach(([key, value]) => {
        formData.append(key, value);
    });
    // must be the last one
    formData.append('file', file);

    const upload = await fetch(post.url, {
        method: 'POST',
        body: formData,
    });
    if (upload.ok) {
        return upload;
    } else {
        console.error('Upload failed.', upload);
        throw new Error('Upload failed.');
    }
}
function UploadMusicModal(props) {
    const auth = useAuth();
    const [pending, setPending] = useState(false);
    const [formAlert, setFormAlert] = useState(null);
    const [file, setMusicFile] = useState(null);

    const { register, handleSubmit, errors } = useForm();

    // This will fetch item if props.id is defined
    // Otherwise query does nothing and we assume
    // we are creating a new item.
    const { data: itemData, status: itemStatus } = useMusic(props.id);

    // If we are updating an existing item
    // don't show modal until item data is fetched.
    if (props.id && itemStatus !== "success") {
        return null;
    }

    const onSubmit = async (formDataParam) => {
        setPending(true);
        try {
            const newMusicData = {
                name: formDataParam.name,
                url: null,
            };
            if (file) {
                const { post, videoUrl } = await getPresignedRequestData(file);
                await uploadFileToS3(post, file);
                newMusicData.url = videoUrl;
            }

            if( !newMusicData.url ) {

                throw new Error('Please upload the music.')

            }

            if( props.id ) {

                /** Update record to db */
                const newResponse = await updateMusic( props.id, { owner: auth.user.uid, ...newMusicData });

            } else {

                /** Add record to db */
                const newResponse = await createMusic({ owner: auth.user.uid, ...newMusicData });

            }

            setPending(false);
            props.onDone();
        } catch (e) {
            console.log("An error occurred!", e.message);
            setFormAlert(e);
            setPending(false);
        }
    };

    return (
        <Modal show={true} centered={true} animation={false} onHide={props.onDone}>
            <Modal.Header closeButton={true}>
                {props.id && <>Update</>}
                {!props.id && <>Create</>}
                {` `}Item
            </Modal.Header>
            <Modal.Body>
                {formAlert && (
                    <FormAlert type={'error'} message={formAlert.message} />
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formName">
                        <FormField
                            size="lg"
                            name="name"
                            label="Name:"
                            type="text"
                            placeholder="your name"
                            defaultValue={itemData && itemData.name}
                            error={errors.name}
                            autoFocus={true}
                            inputRef={register({
                                required: "Please enter a name",
                            })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formFileUpload">
                        <StyledDropzone onDrop={acceptedFiles => setMusicFile(acceptedFiles[0])} />
                    </Form.Group>

                    <Button size="lg" variant="primary" type="submit" disabled={pending}>
                        <span>Save</span>

                        {pending && (
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden={true}
                                className="ml-2"
                            >
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        )}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default UploadMusicModal;
