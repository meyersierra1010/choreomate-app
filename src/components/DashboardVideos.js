import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import FormAlert from "components/FormAlert";
import UploadVideoModal from "components/UploadVideoModal";
import { useAuth } from "util/auth";
import { useVideosByOwner, deleteVideo } from "util/db";
import Link from 'next/link';

function DashboardVideos(props) {
    const auth = useAuth();

    const {
        data: items,
        status: itemsStatus,
        error: itemsError,
    } = useVideosByOwner(auth.user.uid);

    const [creatingItem, setCreatingItem] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    const itemsAreEmpty = !items || items.length === 0;

    return (
        <>
            {itemsError && (
                <div className="mb-3">
                    <FormAlert type="error" message={itemsError.message} />
                </div>
            )}

            <div className="DashboardItems__card-items-wrapper">
                <Card className="card-items">
                    <Card.Header
                        as="h5"
                        className="d-flex justify-content-between align-items-center"
                    >
                        Videos
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setCreatingItem(true)}
                        >
                            Upload Video
                        </Button>
                    </Card.Header>

                    {(itemsStatus === "loading" || itemsAreEmpty) && (
                        <div className="py-5 px-3 align-self-center">
                            {itemsStatus === "loading" && (
                                <Spinner animation="border" variant="primary">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            )}

                            {itemsStatus !== "loading" && itemsAreEmpty && (
                                <>Nothing yet. Click the button to add your first item.</>
                            )}
                        </div>
                    )}

                    {itemsStatus !== "loading" && items && items.length > 0 && (
                        <ListGroup variant="flush">
                            {items.map((item, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className={
                                        `d-flex justify-content-between align-items-center` +
                                        (item.featured ? " featured" : "")
                                    }
                                >
                                    <div>
                                        <h3>{item.name}</h3>
                                        <div>
                                            <span>
                                                {item.url &&
                                                    <Link href={item.url}>
                                                        <a target="_blank">Open original</a>
                                                    </Link>
                                                }
                                            </span>
                                            <span>
                                                {item.unScreenUrl &&
                                                    <Link href={item.unScreenUrl}>
                                                        <a target="_blank">Open GreenScreen</a>
                                                    </Link>
                                                }
                                                {!item.unScreenUrl &&
                                                   <span>Removing background... please wait!</span>
                                                }
                                            </span>
 
                                        </div>
                                    </div>


                                    <div>
                                        <Button
                                            variant="link"
                                            aria-label="update"
                                            onClick={() => setUpdatingItemId(item.id)}
                                            className="action"
                                        >
                                            <i className="fas fa-edit" />
                                        </Button>
                                        <Button
                                            variant="link"
                                            aria-label="delete"
                                            onClick={() => deleteVideo(item.id)}
                                            className="action"
                                        >
                                            <i className="fas fa-trash" />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card>
            </div>

            {creatingItem && <UploadVideoModal onDone={() => setCreatingItem(false)} />}

            {updatingItemId && (
                <UploadVideoModal
                    id={updatingItemId}
                    onDone={() => setUpdatingItemId(null)}
                />
            )}
        </>
    );
}

export default DashboardVideos;
